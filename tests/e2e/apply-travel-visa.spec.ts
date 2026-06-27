import { expect, test, type Page } from '@playwright/test';
import * as admin from 'firebase-admin';

const testUserEmail = process.env.E2E_USER_EMAIL;
const testUserPassword = process.env.E2E_USER_PASSWORD;
const e2eStartupName = `E2E Visa Save ${Date.now()}`;

function getAdminApp() {
    if (admin.apps.length) return admin.app();

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Missing Firebase Admin credentials. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    }

    return admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey })
    });
}

async function ensureRegistrationOpen() {
    const db = getAdminApp().firestore();
    await Promise.all([
        db.doc('settings/registration').set({ isOpen: true, isAllowed: true }, { merge: true }),
        db.doc('settings/editing').set({ isOpen: true, isAllowed: true }, { merge: true })
    ]);
}

async function getApplicationForTestUser() {
    const app = getAdminApp();
    const user = await app.auth().getUserByEmail(getRequiredTestCredentials().email);
    const snapshot = await app.firestore().doc(`applications/${user.uid}`).get();
    return {
        uid: user.uid,
        exists: snapshot.exists,
        data: snapshot.data()
    };
}

const samplePdf = {
    name: 'eligibility-proof.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\n% Venture Craft E2E fixture\n')
};

const samplePng = {
    name: 'identity-document.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
        'base64'
    )
};

function getRequiredTestCredentials() {
    if (!testUserEmail || !testUserPassword) {
        throw new Error(
            [
                'Missing Playwright test credentials.',
                'Set them in PowerShell before running the test, or add E2E_USER_EMAIL and E2E_USER_PASSWORD to .env.local:',
                '$env:E2E_USER_EMAIL="your-test-user@email.com"',
                '$env:E2E_USER_PASSWORD="your-test-password"',
                'npm run test:e2e'
            ].join('\n')
        );
    }

    return {
        email: testUserEmail,
        password: testUserPassword
    };
}

async function signIn(page: Page) {
    const credentials = getRequiredTestCredentials();

    await page.goto(`/signin?redirect=${encodeURIComponent('/apply?preview=1')}`);
    await page.getByLabel('Email Address').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/apply/);
}

async function chooseFirstAvailableCalendarDay(page: Page) {
    await page.getByRole('button', { name: /^1$/ }).last().click();
}

test.describe('application travel and visa flow', () => {
    test.beforeAll(async () => {
        await ensureRegistrationOpen();
    });

    test('submits GCC attendee travel details and verifies Firestore save', async ({ page }) => {
        const credentials = getRequiredTestCredentials();

        await signIn(page);

        await expect(page.getByText('Application Form')).toBeVisible();
        await page.getByRole('button', { name: /Start Application|Continue Editing|Update Submission/i }).click();
        await expect(page.getByText('Personal & Demographic Information')).toBeVisible();

        await page.getByTestId('leader-email').fill(credentials.email);
        await page.getByTestId('leader-phone').fill('512345678');

        await page.getByText('Select who best describes your team...').click();
        await page.getByText("STEM Students & Recent Graduates (0-5 years) - Bachelor's / Diploma").click();

        await page.getByTestId('eligibility-proof-upload').setInputFiles(samplePdf);
        await page.getByTestId('team-member-0-name').fill('Rayan Test');

        await page.getByTestId('travel-attendee-count').fill('1');
        await page.getByTestId('travel-0-full-name').fill('Rayan Test');
        await page.getByTestId('travel-0-date-of-birth').click();
        await chooseFirstAvailableCalendarDay(page);
        await page.getByTestId('travel-0-occupation').fill('Founder');
        await page.getByTestId('travel-0-email').fill(credentials.email);

        await page.getByTestId('travel-0-nationalIdFront-upload').setInputFiles(samplePng);
        await page.getByTestId('travel-0-nationalIdBack-upload').setInputFiles(samplePng);
        await page.getByTestId('travel-0-personalPhoto-upload').setInputFiles(samplePng);

        await page.getByText('I confirm that all team members are 18 years of age or older').click();
        await page.getByText('I confirm that the team leader and/or co-founders').click();

        await page.getByTestId('step-1-next').click();
        await expect(page.getByText('Start-up Details')).toBeVisible();

        await page.getByTestId('startup-name').fill(e2eStartupName);
        await page.getByTestId('startup-location').fill('Dhahran, Saudi Arabia');
        await page.getByRole('button', { name: 'Decarbonization Technologies' }).click();
        await page.getByText('Select stage').click();
        await page.getByText('Ideation').click();
        await page.getByTestId('step-2-next').click();
        await expect(page.getByText('Application Material')).toBeVisible();

        await page.getByTestId('pitch-deck-upload').setInputFiles(samplePdf);
        await page.getByTestId('exec-summary-upload').setInputFiles(samplePdf);
        await page.getByTestId('video-pitch-url').fill('https://youtu.be/dQw4w9WgXcQ');
        await page.getByText('Select source...').click();
        await page.getByText('Other').click();
        await page.getByTestId('final-agreement').check();

        await page.getByTestId('submit-application').click();
        await expect(page.getByText(/Application (Sent|Updated)!/)).toBeVisible({ timeout: 60_000 });

        await expect.poll(
            async () => {
                const result = await getApplicationForTestUser();
                return result.exists ? result.data : null;
            },
            { timeout: 30_000 }
        ).toBeTruthy();

        const saved = (await getApplicationForTestUser()).data;
        expect(saved?.startupName).toBe(e2eStartupName);
        expect(saved?.leaderEmail).toBe(credentials.email);
        expect(saved?.travelVisaInfo?.schemaVersion).toBe(1);
        expect(saved?.travelVisaInfo?.attendingCount).toBe(1);
        expect(saved?.travelVisaInfo?.sponsorshipReviewRequired).toBe(false);
        expect(saved?.travelVisaInfo?.attendees).toHaveLength(1);
        expect(saved?.travelVisaInfo?.attendees?.[0]).toMatchObject({
            fullName: 'Rayan Test',
            occupation: 'Founder',
            email: credentials.email.toLowerCase(),
            sponsorshipStatus: 'Sponsored',
            isGccCitizen: true,
            documents: {
                nationalIdFrontName: samplePng.name,
                nationalIdBackName: samplePng.name,
                personalPhotoName: samplePng.name
            }
        });
        expect(saved?.travelVisaInfo?.attendees?.[0]?.documents?.nationalIdFrontUrl).toContain('blob.vercel-storage.com');
        expect(saved?.travelVisaInfo?.attendees?.[0]?.documents?.nationalIdBackUrl).toContain('blob.vercel-storage.com');
        expect(saved?.travelVisaInfo?.attendees?.[0]?.documents?.personalPhotoUrl).toContain('blob.vercel-storage.com');
    });
});
