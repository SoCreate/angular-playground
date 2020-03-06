import { Browser, ConsoleMessage } from 'puppeteer';

export function delay(ms: number) {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
}

/**
 * Creates a Chromium page and navigates to the host url.
 * If Chromium is not able to connect to the provided page, it will issue a series
 * of retries before it finally fails.
 */
export async function waitForNgServe(browser: Browser, hostUrl: string, timeoutAttempts: number) {
    if (timeoutAttempts === 0) {
        await browser.close();
        throw new Error('Unable to connect to Playground.');
    }

    const page = await browser.newPage();
    let ngServeErrors = 0;

    try {
        page.on('console', (msg: ConsoleMessage) => {
            if (msg.type() === 'error') {
                ngServeErrors++;
            }
        });
        await page.goto(hostUrl);
        setTimeout(() => page.close()); // close page to prevent memory leak
    } catch (e) {
        await page.close();
        await delay(1000);
        await waitForNgServe(browser, hostUrl, timeoutAttempts - 1);
    }

    if (ngServeErrors > 0) {
        throw new Error('ng serve failure');
    }
}
