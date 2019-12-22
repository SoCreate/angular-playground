import { copyFileSync, writeFileSync, unlinkSync, existsSync, readdir } from 'fs';
import { Browser, ConsoleMessage, launch } from 'puppeteer';
import { resolve as resolvePath, isAbsolute } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { runCLI } from '@jest/core';
import { Config as JestConfig } from '@jest/types';
import { SandboxFileInformation } from './build-sandboxes';
import { Config, ViewportOptions } from './configure';
import { delay, removeDynamicImports } from './utils';

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = ['--disable-gpu', '--no-sandbox'];
const SANDBOX_PATH = resolvePath(__dirname, '../../../dist/build/src/shared/sandboxes.js');
const SANDBOX_DEST = resolvePath(__dirname, '../../../sandboxes_modified.js');
const TEST_PATH_BASE = resolvePath(__dirname, '../../../dist/jest/test.js');

let browser: Browser;

// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', async () => {
    if (browser) await browser.close();
});

export async function checkSnapshots(config: Config) {
    copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
    removeDynamicImports(SANDBOX_DEST);
    clearOldTestFiles(config.viewportSizes[0]);
    if (config.deleteSnapshots) {
        deleteSnapshots(config);
    } else {
        const hostUrl = `http://${config.angularCliHost}:${config.angularCliPort}`;

        let overallExitCode = 0;
        if (config.viewportSizes.length > 0) {
            for (const viewportConfig of config.viewportSizes) {
                const viewportSize = {
                  width: viewportConfig.width,
                  height: viewportConfig.height,
                };
                const testPath = getTestPath(viewportSize, `-${formatViewportSize(viewportSize)}`);
                writeSandboxesToTestFile(config, hostUrl, testPath, viewportSize);
                const exitCode = await main(config, hostUrl, viewportSize);
                if (exitCode !== 0) {
                  overallExitCode = exitCode;
                }
            }
        } else {
            const testPath = getTestPath();
            writeSandboxesToTestFile(config, hostUrl, testPath);
            overallExitCode = await main(config, hostUrl);
        }
        process.exit(overallExitCode);
    }
}

/////////////////////////////////

async function main(config: Config, hostUrl: string, viewportSize?: ViewportOptions) {
    const timeoutAttempts = config.timeout;
    browser = await launch({
        headless: true,
        handleSIGINT: false,
        args: CHROME_ARGS,
    });

    await waitForNgServe(hostUrl, timeoutAttempts);
    const execAsync = promisify(exec);
    await execAsync('cd node_modules/angular-playground');

    const testRegex = viewportSize
        ? `test-${formatViewportSize(viewportSize)}\\.js$`
        : 'test\\.js';
    const argv = {
        config: 'node_modules/angular-playground/dist/jest/jest-puppeteer.config.js',
        updateSnapshot: !!config.updateSnapshots,
        testRegex,
    } as JestConfig.Argv;
    const projectPath = resolvePath('.');
    const projects = [projectPath];
    const { results } = await runCLI(argv, projects);

    await browser.close();
    const exitCode = results.numFailedTests === 0 ? 0 : 1;
    return exitCode;
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

function normalizeResolvePath(directory) {
    return isAbsolute(directory)
        ? directory.replace(/\\/g, '/')
        : resolvePath('.', directory).replace(/\\/g, '/');
}

function deleteSnapshots(config: Config) {
    try {
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

function writeSandboxesToTestFile(config: Config, hostUrl: string, testPath: string, viewportSize?: ViewportOptions) {
    const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
    const absoluteDiffDirectory = normalizeResolvePath(config.diffDirectory);
    try {
        const items: SandboxFileInformation[] = require(SANDBOX_DEST).getSandboxMenuItems();
        const testPaths = [];
        items.forEach((item) => {
            item.scenarioMenuItems.forEach((scenarioItem) => {
                if (item.key.includes(config.pathToSandboxes)) {
                    testPaths.push({
                        sandboxKey: item.key,
                        scenarioKey: scenarioItem.key,
                        url: `${encodeURIComponent(item.key)}/${encodeURIComponent(scenarioItem.description)}`,
                        label: `${item.name} [${scenarioItem.description}]`,
                    });
                }
            });
        }, []);

        const extraConfig = Object.keys(config.imageSnapshotConfig)
            .map(key => `${key}: ${JSON.stringify(config.imageSnapshotConfig[key])}`)
            .join(',');
        const result = `
          // imports
          const chalk = require('chalk');
          // declarations
          const tests = ${JSON.stringify(testPaths)};
          const buildIdentifier = (url) => {
            return decodeURIComponent(url + '-' + ${JSON.stringify(formatViewportSize(viewportSize))})
              .substr(2)
              .replace(/[\\/\\.]|\\s+/g, '-')
              .replace(/[^a-z0-9\\-]/gi, '');
          };
          const excluded = ${JSON.stringify(config.visualRegressionIgnore)}.map(item => new RegExp(item.regex, item.flags));
          // checks if sandbox identifier matches an excluded regex
          const checkIfExcluded = (url) => {
            for (const excludedRegex of excluded) {
              if (excludedRegex.test(url)) {
                return true;
              }
            }
            return false;
          }
          // set up tests
          beforeAll(async () => {
            ${viewportSize ? `await page.setViewport(${JSON.stringify(viewportSize)})` : ''}
            await page.goto('${hostUrl}');
            // mock current time
            await page.addScriptTag({ path: './node_modules/mockdate/src/mockdate.js' });
            await page.addScriptTag({ content: 'MockDate.set(${config.visualRegressionMockDate}, 0);' });
          });
          // run tests
          describe('Playground snapshot tests${viewportSize ? ` [${formatViewportSize(viewportSize)}]` : ''}', () => {
            for (let i = 0; i < tests.length; i++) {
              const test = tests[i];

              it(\`should match \${test.label}\`, async () => {
                if (!checkIfExcluded(buildIdentifier(test.url))) {
                  const url = \`${hostUrl}?scenario=\${test.url}\`;
                  console.log(\`Checking [\${i + 1}/\${tests.length}]: \${url}\`);

                  // load scenario
                  const waitForNavigation = page.waitForNavigation({ waitUntil: 'networkidle0' });
                  await page.evaluate((sandboxKey, scenarioKey) => window.loadScenario(sandboxKey, scenarioKey),
                    test.sandboxKey, test.scenarioKey)
                  await Promise.all([
                    waitForNavigation,
                    page.waitFor(() => window.isPlaygroundComponentLoaded()),
                  ]);
                  const sleep = (ms) => new Promise(res => setTimeout(res, ms));
                  await sleep(100); // sleep for a bit in case page elements are still being rendered

                  // take screenshot
                  const image = await page.screenshot({ fullPage: ${!viewportSize} });

                  // check for diffs
                  expect(image).toMatchImageSnapshot({
                    customSnapshotsDir: '${absoluteSnapshotDirectory}',
                    customDiffDir: '${absoluteDiffDirectory}',
                    customSnapshotIdentifier: () => buildIdentifier(test.url),
                    ${extraConfig}
                  });
                } else {
                  console.log(chalk.red(\`SKIPPED [\${i + 1}/\${tests.length}]: \${buildIdentifier(test.url)}\`));
                }
              }, 30000);
            }
          });
        `;
        writeFileSync(testPath, result, { encoding: 'utf-8' });
    } catch (err) {
        throw new Error(`Failed to create snapshot test file. ${err}`);
    }
}

const clearOldTestFiles = (viewportSize: ViewportOptions) => {
    try {
        const removeTestPath = getTestPath(viewportSize, '*');
        readdir('.', (error, files) => {
            if (error) throw error;
            files.filter(name => new RegExp(removeTestPath).test(name)).forEach(unlinkSync);
        });
    } catch (err) {
        throw new Error(`Couldn't delete previous test files.`);
    }
};

const getTestPath = (viewportSize?: ViewportOptions, suffix = '') =>
    viewportSize
        ? TEST_PATH_BASE.replace('test.js', `test${suffix}.js`)
        : TEST_PATH_BASE;

const formatViewportSize = (viewportSize?: ViewportOptions) =>
    viewportSize ? `${viewportSize.width}x${viewportSize.height}` : '';
