import { copyFileSync, writeFileSync } from 'fs';
import * as puppeteer from 'puppeteer';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { runCLI } from '@jest/core';
import { Config as JestConfig } from '@jest/types';
import { SandboxFileInformation } from './build-sandboxes';
import { Config } from './configure';
import { delay, removeDynamicImports } from './utils';

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = [ '--disable-gpu', '--no-sandbox' ];
const SANDBOX_PATH = resolvePath(__dirname, '../../../dist/build/src/shared/sandboxes.js');
const SANDBOX_DEST = resolvePath(__dirname, '../../../sandboxes_modified.js');
const TEST_PATH = resolvePath(__dirname, '../../../jest/test.js');

let browser: puppeteer.Browser;

// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', async () => {
    if (browser) await browser.close();
});

export async function checkSnapshots(config: Config) {
    copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
    removeDynamicImports(SANDBOX_DEST);
    const hostUrl = `http://${config.angularCliHost}:${config.angularCliPort}`;
    writeSandboxesToTestFile(config, hostUrl);
    await main(config, hostUrl);
}

/////////////////////////////////

async function main(config: Config, hostUrl: string) {
    const timeoutAttempts = config.timeout;
    browser = await puppeteer.launch({
        headless: true,
        handleSIGINT: false,
        args: CHROME_ARGS,
    });

    await waitForNgServe(hostUrl, timeoutAttempts);
    const execAsync = promisify(exec);
    await execAsync('cd node_modules/angular-playground');

    const argv = {
      config: 'node_modules/angular-playground/jest/jest-puppeteer.config.js',
      updateSnapshot: !!config.updateSnapshots,
    } as JestConfig.Argv;
    const projectPath = resolvePath('.');
    const projects = [projectPath];
    const { results } = await runCLI(argv, projects);

    await browser.close();
    const exitCode = results.numFailedTests === 0 ? 0 : 1;
    process.exit(exitCode);
}

/**
 * Creates a Chromium page and navigates to the host url.
 * If Chromium is not able to connect to the provided page, it will issue a series
 * of retries before it finally fails.
 */
async function waitForNgServe(hostUrl: string, timeoutAttempts: number) {
    if (timeoutAttempts === 0) {
        await browser.close();
        throw new Error('Unable to connect to Playground.');
    }

    const page = await browser.newPage();

    try {
        await page.goto(hostUrl);
        setTimeout(() => page.close()); // close page to prevent memory leak
    } catch (e) {
        await page.close();
        await delay(1000);
        await waitForNgServe(hostUrl, timeoutAttempts - 1);
    }
}

function writeSandboxesToTestFile(config: Config, hostUrl: string) {
    const normalizeResolvePath = (directory: string) => resolvePath('.', directory).replace(/\\/g, '/');
    const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
    const absoluteDiffDirectory = normalizeResolvePath(config.diffDirectory);
    try {
        const items: SandboxFileInformation[] = require(SANDBOX_DEST).getSandboxMenuItems();
        const testPaths = [];
        items.forEach((item) => {
            item.scenarioMenuItems.forEach((scenarioItem) => {
                if (item.key.includes(config.updateSnapshotsDirectory)) {
                    testPaths.push({
                        url: `${encodeURIComponent(item.key)}/${encodeURIComponent(scenarioItem.description)}`,
                        label: `${item.name} ${scenarioItem.description}`,
                    });
                }
            });
        }, []);
        const extraConfig = Object.keys(config.imageSnapshotConfig)
            .map(key => `${key}: ${JSON.stringify(config.imageSnapshotConfig[key])}`)
            .join(',');
        const result = `
          const tests = ${JSON.stringify(testPaths)};
          describe('Playground snapshot tests', () => {
            for (let i = 0; i < tests.length; i++) {
              const test = tests[i];
              it(\`should match \${test.label}\`, async () => {
                const url = \`${hostUrl}?scenario=\${test.url}\`;
                console.log(\`Checking [\${i + 1}/\${tests.length}]: \${url}\`);
                await page.goto(url);
                const image = await page.screenshot({ fullPage: true });
                expect(image).toMatchImageSnapshot({
                  customSnapshotsDir: '${absoluteSnapshotDirectory}',
                  customDiffDir: '${absoluteDiffDirectory}',
                  ${extraConfig}
                });
              });
            }
          });
        `;
        writeFileSync(TEST_PATH, result, { encoding: 'utf-8' });
    } catch (err) {
        throw new Error(`Failed to create snapshot test file. ${err}`);
    }
}
