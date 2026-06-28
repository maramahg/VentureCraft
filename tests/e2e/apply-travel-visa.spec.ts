import { expect, test, type Page } from '@playwright/test';
import * as admin from 'firebase-admin';

const testUserEmail = process.env.E2E_USER_EMAIL;
const testUserPassword = process.env.E2E_USER_PASSWORD;

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

async function getTestUser() {
    return getAdminApp().auth().getUserByEmail(getRequiredTestCredentials().email);
}

async function setRegistration(open: boolean) {
    const db = getAdminApp().firestore();
    await Promise.all([
        db.doc('settings/registration').set({ isOpen: open, isAllowed: open }, { merge: true }),
        db.doc('settings/editing').set({ isOpen: true, isAllowed: true }, { merge: true })
    ]);
}

async function resetTestApplication() {
    const user = await getTestUser();
    await getAdminApp().firestore().doc(`applications/${user.uid}`).delete();
}

async function getApplicationForTestUser() {
    const user = await getTestUser();
    const snapshot = await getAdminApp().firestore().doc(`applications/${user.uid}`).get();
    return {
        uid: user.uid,
        exists: snapshot.exists,
        data: snapshot.data()
    };
}

async function signIn(page: Page, path = '/apply') {
    const credentials = getRequiredTestCredentials();

    await page.goto(`/signin?redirect=${encodeURIComponent(path)}`);
    await page.getByLabel('Email Address').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(new RegExp(path.replace('?', '\\?')));
}

async function pickCalendarDay(page: Page, testId: string, day = '1') {
    await page.getByTestId(testId).click();
    await page.getByRole('button', { name: new RegExp(`^${day}$`) }).last().click();
}

async function selectOption(page: Page, testId: string, option: string) {
    await page.getByTestId(testId).click();
    await page.getByTestId(`${testId}-option-${option}`).click();
}

async function openApplicationForm(page: Page) {
    await expect(page.getByText('Application Form')).toBeVisible();
    await page.getByRole('button', { name: /Start Application|Continue Editing|Update Submission/i }).click();
    await expect(page.getByText('Personal & Demographic Information')).toBeVisible();
}

async function fillBaseStepOne(page: Page, attendeeCount = 1) {
    const credentials = getRequiredTestCredentials();

    await page.getByTestId('leader-email').fill(credentials.email);
    await page.getByTestId('leader-phone').fill('512345678');
    await page.getByText('Select who best describes your team...').click();
    await page.getByText("STEM Students & Recent Graduates (0-5 years) - Bachelor's / Diploma").click();
    await page.getByTestId('eligibility-proof-upload').setInputFiles(samplePdf);
    await page.getByTestId('team-member-0-name').fill('Rayan Test');
    await page.getByTestId('travel-attendee-count').fill(String(attendeeCount));
}

async function fillGccAttendee(page: Page, index: number, name = `Rayan GCC ${index + 1}`) {
    const credentials = getRequiredTestCredentials();

    await page.getByTestId(`travel-${index}-full-name`).fill(name);
    await pickCalendarDay(page, `travel-${index}-date-of-birth`);
    await page.getByTestId(`travel-${index}-occupation`).fill('Founder');
    await page.getByTestId(`travel-${index}-email`).fill(credentials.email);
    await page.getByTestId(`travel-${index}-nationalIdFront-upload`).setInputFiles(samplePng);
    await page.getByTestId(`travel-${index}-nationalIdBack-upload`).setInputFiles(samplePng);
    await page.getByTestId(`travel-${index}-personalPhoto-upload`).setInputFiles(samplePng);
}

async function fillNonGccAttendee(page: Page) {
    const credentials = getRequiredTestCredentials();

    await page.getByTestId('travel-0-full-name').fill('Rayan Non GCC');
    await pickCalendarDay(page, 'travel-0-date-of-birth');
    await page.getByTestId('travel-0-occupation').fill('Founder');
    await page.getByTestId('travel-0-gcc-citizen-No').click();
    await page.getByTestId('travel-0-passportBioPage-upload').setInputFiles(samplePng);
    await page.getByTestId('travel-0-passport-number').fill('P1234567');
    await pickCalendarDay(page, 'travel-0-passport-issue-date');
    await pickCalendarDay(page, 'travel-0-passport-expiry-date');
    await page.getByTestId('travel-0-passport-blank-pages').fill('1');
    await page.getByTestId('travel-0-personalPhoto-upload').setInputFiles(samplePng);
    await page.getByTestId('travel-0-email').fill(credentials.email);

    await selectOption(page, 'travel-0-has-saudi-visa', 'Yes');
    await selectOption(page, 'travel-0-saudi-visa-type', 'eVisa');
    await selectOption(page, 'travel-0-saudi-visa-entry-type', 'Multiple');
    await pickCalendarDay(page, 'travel-0-saudi-visa-issue-date');
    await pickCalendarDay(page, 'travel-0-saudi-visa-expiry-date');
    await selectOption(page, 'travel-0-saudi-visa-used-before', 'Yes');

    await selectOption(page, 'travel-0-has-us-uk-schengen', 'Yes');
    await selectOption(page, 'travel-0-us-uk-schengen-type', 'US');
    await pickCalendarDay(page, 'travel-0-us-uk-schengen-expiry-date');
    await selectOption(page, 'travel-0-us-uk-schengen-used-before', 'Yes');

    await selectOption(page, 'travel-0-has-gcc-residency', 'Yes');
    await selectOption(page, 'travel-0-gcc-residency-country', 'Qatar');
    await pickCalendarDay(page, 'travel-0-gcc-residency-expiry-date');
    await page.getByTestId('travel-0-gccResidencyFront-upload').setInputFiles(samplePng);
    await page.getByTestId('travel-0-gccResidencyBack-upload').setInputFiles(samplePng);
}

async function confirmEligibility(page: Page) {
    await page.getByText('I confirm that all team members are 18 years of age or older').click();
    await page.getByText('I confirm that the team leader and/or co-founders').click();
}

async function completeStepTwo(page: Page, startupName: string) {
    await page.getByTestId('step-1-next').click();
    await expect(page.getByText('Start-up Details')).toBeVisible();
    await page.getByTestId('startup-name').fill(startupName);
    await page.getByTestId('startup-location').fill('Dhahran, Saudi Arabia');
    await page.getByRole('button', { name: 'Decarbonization Technologies' }).click();
    await page.getByText('Select stage').click();
    await page.getByText('Ideation').click();
    await page.getByTestId('step-2-next').click();
    await expect(page.getByRole('heading', { name: 'Application Material' })).toBeVisible();
}

async function submitStepThree(page: Page) {
    await page.getByTestId('pitch-deck-upload').setInputFiles(samplePdf);
    await page.getByTestId('exec-summary-upload').setInputFiles(samplePdf);
    await page.getByTestId('video-pitch-url').fill('https://youtu.be/dQw4w9WgXcQ');
    await selectOption(page, 'referral-source', 'Other');
    await page.getByTestId('final-agreement').check();
    await page.getByTestId('submit-application').click();
    await expect(page.getByText(/Application (Sent|Updated)!/)).toBeVisible({ timeout: 60_000 });
}

async function submitApplication(page: Page, startupName: string) {
    await completeStepTwo(page, startupName);
    await submitStepThree(page);
}

test.describe('application travel and visa flow', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async () => {
        await setRegistration(true);
        await resetTestApplication();
    });

    test.afterAll(async () => {
        await setRegistration(true);
    });

    test('submits GCC attendee travel details and verifies Firestore save', async ({ page }) => {
        const credentials = getRequiredTestCredentials();
        const startupName = `E2E GCC Visa Save ${Date.now()}`;

        await signIn(page);
        await openApplicationForm(page);
        await fillBaseStepOne(page);
        await fillGccAttendee(page, 0, 'Rayan Test');
        await confirmEligibility(page);
        await submitApplication(page, startupName);

        const saved = (await getApplicationForTestUser()).data;
        expect(saved?.startupName).toBe(startupName);
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
        expect(saved?.travelVisaInfo?.attendees?.[0]?.passportDetails).toBeUndefined();
    });

    test('submits non-GCC passport and visa branches with warning flags', async ({ page }) => {
        const startupName = `E2E Non GCC Visa Save ${Date.now()}`;

        await signIn(page);
        await openApplicationForm(page);
        await fillBaseStepOne(page);
        await fillNonGccAttendee(page);
        await confirmEligibility(page);
        await submitApplication(page, startupName);

        const attendee = (await getApplicationForTestUser()).data?.travelVisaInfo?.attendees?.[0];
        expect(attendee).toMatchObject({
            fullName: 'Rayan Non GCC',
            isGccCitizen: false,
            passportDetails: {
                passportNumber: 'P1234567',
                blankPages: 1
            },
            warnings: {
                passportExpiryUnderSixMonthsFromArrival: true,
                blankPassportPagesUnderTwo: true
            },
            existingSaudiVisa: {
                hasVisa: true,
                visaType: 'eVisa',
                entryType: 'Multiple',
                usedToEnterKsaBefore: 'Yes'
            },
            usUkSchengenVisaOrResidence: {
                hasVisaOrResidence: true,
                type: 'US',
                usedToTravelToIssuingCountry: 'Yes'
            },
            gccResidency: {
                hasResidency: true,
                country: 'Qatar'
            },
            documents: {
                passportBioPageName: samplePng.name,
                personalPhotoName: samplePng.name,
                gccResidencyFrontName: samplePng.name,
                gccResidencyBackName: samplePng.name
            }
        });
        expect(attendee?.documents?.passportBioPageUrl).toContain('blob.vercel-storage.com');
        expect(attendee?.documents?.gccResidencyFrontUrl).toContain('blob.vercel-storage.com');
        expect(attendee?.documents?.gccResidencyBackUrl).toContain('blob.vercel-storage.com');
    });

    test('marks sponsorship review when more than two attendees are sponsored', async ({ page }) => {
        const startupName = `E2E Sponsored Review ${Date.now()}`;

        await signIn(page);
        await openApplicationForm(page);
        await fillBaseStepOne(page, 3);
        await fillGccAttendee(page, 0, 'Sponsored One');
        await fillGccAttendee(page, 1, 'Sponsored Two');
        await fillGccAttendee(page, 2, 'Sponsored Three');
        await expect(page.getByText('More than 2 attendees are marked Sponsored')).toBeVisible();
        await confirmEligibility(page);
        await submitApplication(page, startupName);

        const travelVisaInfo = (await getApplicationForTestUser()).data?.travelVisaInfo;
        expect(travelVisaInfo?.attendingCount).toBe(3);
        expect(travelVisaInfo?.attendees).toHaveLength(3);
        expect(travelVisaInfo?.sponsorshipReviewRequired).toBe(true);
    });

    test('blocks step 1 when required visa fields and files are missing', async ({ page }) => {
        await signIn(page);
        await openApplicationForm(page);
        await page.getByTestId('step-1-next').click();

        await expect(page.getByText("Please enter the team leader's email address.")).toBeVisible();
        await expect(page.getByText('Please upload the national ID front side.')).toBeVisible();
        await expect(page.getByText('Please upload a personal photo.')).toBeVisible();
        await expect(page.getByText('Start-up Details')).not.toBeVisible();
    });

    test('limits physical attendees to ten', async ({ page }) => {
        await signIn(page);
        await openApplicationForm(page);

        await page.getByTestId('travel-attendee-count').fill('11');
        await expect(page.getByTestId('travel-attendee-count')).toHaveValue('10');
        await expect(page.getByText('Attendee 10')).toBeVisible();
        await expect(page.getByText('Attendee 11')).not.toBeVisible();
    });

    test('blocks normal application access when registration is closed', async ({ page }) => {
        await setRegistration(false);
        await signIn(page);

        await expect(page.getByRole('heading', { name: 'Applications are Now Closed' })).toBeVisible();
        await expect(page.getByText('Preview Form Locally')).toBeVisible();
    });
});
