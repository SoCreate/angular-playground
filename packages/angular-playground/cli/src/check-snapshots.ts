import { copyFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { Browser, ConsoleMessage, launch } from 'puppeteer';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { runCLI } from '@jest/core';
import { Config as JestConfig } from '@jest/types';
import { SandboxFileInformation } from './build-sandboxes';
import { Config } from './configure';
import { delay, removeDynamicImports } from './utils';

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = ['--disable-gpu', '--no-sandbox'];
const SANDBOX_PATH = resolvePath(__dirname, '../../../dist/build/src/shared/sandboxes.js');
const SANDBOX_DEST = resolvePath(__dirname, '../../../sandboxes_modified.js');
const TEST_PATH = resolvePath(__dirname, '../../../dist/jest/test.js');

let browser: Browser;

// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', async () => {
    if (browser) await browser.close();
});

export async function checkSnapshots(config: Config) {
    copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
    removeDynamicImports(SANDBOX_DEST);
    if (config.deleteSnapshots) {
        deleteSnapshots(config);
    } else {
        const hostUrl = `http://${config.angularCliHost}:${config.angularCliPort}`;
        writeSandboxesToTestFile(config, hostUrl);
        await main(config, hostUrl);
    }
}

/////////////////////////////////

async function main(config: Config, hostUrl: string) {
    const timeoutAttempts = config.timeout;
    browser = await launch({
        headless: true,
        handleSIGINT: false,
        args: CHROME_ARGS,
    });

    await waitForNgServe(hostUrl, timeoutAttempts);
    const execAsync = promisify(exec);
    await execAsync('cd node_modules/angular-playground');

    const argv = {
        config: 'node_modules/angular-playground/dist/jest/jest-puppeteer.config.js',
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
        await waitForNgServe(hostUrl, timeoutAttempts - 1);
    }

    if (ngServeErrors > 0) {
        throw new Error('ng serve failure');
    }
}

function deleteSnapshots(config: Config) {
    try {
        const normalizeResolvePath = (directory: string) => resolvePath('.', directory).replace(/\\/g, '/');
        const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
        const items: SandboxFileInformation[] = require(SANDBOX_DEST).getSandboxMenuItems();
        const buildIdentifier = (url) => {
            return decodeURIComponent(url)
                .substr(2)
                .replace(/[\/.]|\s+/g, '-')
                .replace(/[^a-z0-9\-]/gi, '');
        };

        let filesDeleted = false;
        items.forEach((item) => {
            item.scenarioMenuItems.forEach((scenarioItem) => {
                if (item.key.includes(config.pathToSandboxes)) {
                    const url = `${encodeURIComponent(item.key)}/${encodeURIComponent(scenarioItem.description)}`;
                    const filePath = `${absoluteSnapshotDirectory}/${buildIdentifier(url)}-snap.png`;
                    if (existsSync(filePath)) {
                        unlinkSync(filePath);
                        console.log(`Deleted file: ${filePath}`);
                        filesDeleted = true;
                    }
                }
            });
        });
        if (!filesDeleted) {
            console.log('No snapshots were deleted.');
        }
    } catch (err) {
        throw new Error(`Failed to delete snapshots. ${err}`);
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
                if (item.key.includes(config.pathToSandboxes)) {
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
          const buildIdentifier = (url) => {
            return decodeURIComponent(url)
              .substr(2)
              .replace(/[\\/\\.]|\\s+/g, '-')
              .replace(/[^a-z0-9\\-]/gi, '');
          };
          describe('Playground snapshot tests', () => {
            for (let i = 0; i < tests.length; i++) {
              const test = tests[i];
              it(\`should match \${test.label}\`, async () => {
                const url = \`${hostUrl}?scenario=\${test.url}\`;
                console.log(\`Checking [\${i + 1}/\${tests.length}]: \${url}\`);
                await page.goto(url, { waitUntil: 'load' });
                await page.waitFor(() => !!document.querySelector('playground-host'));
                const image = await page.screenshot({ fullPage: true });
                expect(image).toMatchImageSnapshot({
                  customSnapshotsDir: '${absoluteSnapshotDirectory}',
                  customDiffDir: '${absoluteDiffDirectory}',
                  customSnapshotIdentifier: () => buildIdentifier(test.url),
                  ${extraConfig}
                });
              }, 30000);
            }
          });
        `;
        writeFileSync(TEST_PATH, result, { encoding: 'utf-8' });
    } catch (err) {
        throw new Error(`Failed to create snapshot test file. ${err}`);
    }
}
