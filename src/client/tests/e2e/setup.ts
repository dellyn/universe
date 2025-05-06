import {test as baseTest} from '@playwright/test';
export * from '@playwright/test';

export const test = baseTest.extend({

    page: async ({page}, use, testInfo) => {
        const {timeout} = testInfo.project;
        const {actionTimeout = 1} = testInfo.project.use;
        // Set a longer timeout for retries
        if (testInfo.retry) {
            page.setDefaultTimeout(actionTimeout * 2);
            testInfo.setTimeout(timeout * 2);
        }

        await use(page);
    }
});
export function getTestIdSelector(testId = '', selector = ''): string {
    return `[data-wdio=${testId}${selector || ''}]`;
}

export const appUrl = 'http://localhost:3000';
