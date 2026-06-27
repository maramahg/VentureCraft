import { expect, test, type Page } from '@playwright/test';

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
                'Set them in PowerShell before running the test:',
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
    test('fills GCC attendee travel details and advances from step 1', async ({ page }) => {
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
    });
});
