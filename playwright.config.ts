import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadLocalEnvFile(fileName: string) {
    const filePath = resolve(process.cwd(), fileName);
    if (!existsSync(filePath)) return;

    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) continue;

        const key = trimmed.slice(0, separatorIndex).trim().replace(/^\$env:/, '');
        const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

loadLocalEnvFile('.env.local');
loadLocalEnvFile('.env.e2e.local');

const port = Number(process.env.PLAYWRIGHT_PORT || 3100);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 60_000,
    expect: {
        timeout: 10_000
    },
    fullyParallel: false,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL,
        launchOptions: {
            slowMo: Number(process.env.PLAYWRIGHT_SLOW_MO || 250)
        },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    webServer: {
        command: `npx next dev --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
            ...process.env,
            NEXT_PUBLIC_ENABLE_FORM_PREVIEW: 'true'
        }
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome'
            }
        }
    ]
});
