import { writeFileSync, unlinkSync, existsSync, readdirSync } from 'fs';
import { Browser, launch } from 'puppeteer';
import { resolve as resolvePath, isAbsolute } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { runCLI } from '@jest/core';
import { Config as JestConfig } from '@jest/types';
import { SANDBOX_MENU_ITEMS_FILE, SandboxFileInformation } from './build-sandboxes';
import { Config } from './configure';
import { waitForNgServe } from './utils';

export interface ViewportOptions {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  isLandscape?: boolean;
}

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = ['--disable-gpu', '--no-sandbox'];
const TEST_PATH_BASE = resolvePath(__dirname, '../../dist/jest/test.js');

let browser: Browser;

// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', async () => {
    if (browser) { await browser.close(); }
});

export async function checkSnapshots(config: Config) {
    if (config.deleteSnapshots) {
        deleteSnapshots(config);
    } else {
        const hostUrl = `http://${config.angularCliHost}:${config.angularCliPort}`;
        let overallExitCode = 0;

        if (config.viewportSizes.length > 0) {
            for (const viewportConfig of config.viewportSizes) {
                const testPath = getTestPath(`-${formatViewportSize(viewportConfig)}`);
                const exitCode = await main(config, hostUrl, testPath, viewportConfig);
                if (exitCode !== 0) {
                  overallExitCode = exitCode;
                }
            }
        } else {
            const testPath = getTestPath();
            overallExitCode = await main(config, hostUrl, testPath);
        }
        process.exit(overallExitCode);
    }
}

/////////////////////////////////

async function main(config: Config, hostUrl: string, testPath: string, viewportConfig?: ViewportOptions) {
    // create test file to run with jest
    writeSandboxesToTestFile(config, hostUrl, testPath, viewportConfig);

    // launch puppeteer headless browser to render scenarios
    browser = await launch({
        headless: true,
        handleSIGINT: false,
        args: CHROME_ARGS,
    });

    const timeoutAttempts = config.timeout;
    await waitForNgServe(browser, hostUrl, timeoutAttempts);
    const execAsync = promisify(exec);
    await execAsync('cd node_modules/angular-playground');

    const testRegex = viewportConfig
        ? `test-${formatViewportSize(viewportConfig)}\\.js$`
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



function normalizeResolvePath(directory) {
    const absolutePath = isAbsolute(directory) ? directory : resolvePath('.', directory);
    return absolutePath.replace(/\\/g, '/');
}

function deleteSnapshots(config: Config) {
    try {
        const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
        const items: SandboxFileInformation[] = require(SANDBOX_MENU_ITEMS_FILE).getSandboxMenuItems();
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

function writeSandboxesToTestFile(config: Config, hostUrl: string, testPath: string, viewportConfig?: ViewportOptions) {
    const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
    const absoluteDiffDirectory = normalizeResolvePath(config.diffDirectory);
    try {
        const items: SandboxFileInformation[] = require(SANDBOX_MENU_ITEMS_FILE).getSandboxMenuItems();
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
            return decodeURIComponent(url + '-' + ${JSON.stringify(formatViewportSize(viewportConfig))})
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
            ${viewportConfig ? `await page.setViewport(${JSON.stringify(viewportConfig)})` : ''}
            await page.goto('${hostUrl}');
            // mock current time
            await page.addScriptTag({ path: './node_modules/mockdate/src/mockdate.js' });
            await page.addScriptTag({ content: 'MockDate.set(${config.visualRegressionMockDate}, 0);' });
          });
          // run tests
          describe('Playground snapshot tests${viewportConfig ? ` [${formatViewportSize(viewportConfig)}]` : ''}', () => {
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
                    page.waitFor(() => window.isPlaygroundComponentLoaded() || window.isPlaygroundComponentLoadedWithErrors()),
                  ]);
                  const sleep = (ms) => new Promise(res => setTimeout(res, ms));
                  await sleep(100); // sleep for a bit in case page elements are still being rendered

                  // take screenshot
                  const image = await page.screenshot({ fullPage: ${!viewportConfig} });

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
        clearOldTestFiles();
        writeFileSync(testPath, result, { encoding: 'utf-8' });
    } catch (err) {
        throw new Error(`Failed to create snapshot test file. ${err}`);
    }
}

const clearOldTestFiles = () => {
    try {
        const folderPath = getTestPath().replace('test.js', '');
        const oldTestFiles = readdirSync(folderPath)
          .filter(name => /test(-\d+x\d+)\.js$/.test(name));
        for (const name of oldTestFiles) {
          unlinkSync(`${folderPath}${name}`);
        }
    } catch (err) {
        throw new Error(`Couldn't delete previous test files.`);
    }
};

const getTestPath = (suffix = '') =>
    TEST_PATH_BASE.replace('test.js', `test${suffix}.js`);

const formatViewportSize = (viewportConfig?: ViewportOptions) =>
    viewportConfig ? `${viewportConfig.width}x${viewportConfig.height}` : '';
