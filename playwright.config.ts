import {defineConfig, devices} from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
const appUrl = 'http://localhost:3000';
const isCI = process.env.CI;
const buildCommand = isCI ? '' : 'npm run dev';
const testTimeout = 1000 * 60;
const actionTimout = isCI ? 6000 : 10000;
const expectTimeout = actionTimout;
const retries = isCI ? 2 : 0;

export default defineConfig({
    testDir: './src/client/tests/e2e',
    workers: isCI ? 1 : 4,
    retries,
    forbidOnly: !!isCI,
    fullyParallel: false,
    reporter: [['list'], ['html', {outputFolder: 'test-results/report/', open: 'always'}]],
    outputDir: 'test-results/output/',
    use: {
        baseURL: appUrl,
        screenshot: isCI ? 'on' : 'off',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        testIdAttribute: 'id', // Bad practice, but it's because of MUI. I hate it
        actionTimeout: actionTimout,
        acceptDownloads: true
    },
    expect: {
        timeout: expectTimeout
    },
    testMatch: ['**/desktop-*.test.ts', '**/mobile-*.test.ts'],
    projects: [
        {
            name: 'mobile-webkit',
            use: {
                ...devices['iPhone 13'],
                actionTimeout: actionTimout * 2
            },
            expect: {timeout: expectTimeout * 2},
            testMatch: ['**/mobile-*.test.ts']
        },
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
            timeout: isCI ? testTimeout : testTimeout * 2,
            testMatch: ['**/desktop-*.test.ts']
        },
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
            timeout: isCI ? testTimeout : testTimeout * 2,
            testMatch: ['**/desktop-*.test.ts']
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                actionTimeout: actionTimout * 2
            },
            timeout: isCI ? testTimeout * 1.5 : testTimeout * 1.5 * 2,
            testMatch: ['**/desktop-*.test.ts']
        }
    ],
    webServer: isCI ? undefined : {
        command: buildCommand,
        url: appUrl,
        timeout: 1000 * 60,
        reuseExistingServer: true
    }
});
