import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import * as puppeteer from 'puppeteer';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { runCLI } from '@jest/core';
import { Config as JestConfig } from '@jest/types';
import { Config } from './configure';
import { ErrorReporter, REPORT_TYPE } from './error-reporter';

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = [ '--disable-gpu', '--no-sandbox' ];
const SANDBOX_PATH = resolvePath(__dirname, '../../../dist/build/src/shared/sandboxes.js');
const SANDBOX_DEST = resolvePath(__dirname, '../../../sandboxes_modified.js');
const TEST_PATH = resolvePath(__dirname, '../../../jest/test.js');

export interface ScenarioSummary {
    url: string;
    name: string;
    description: string;
}

let browser: any;
let reporter: ErrorReporter;

// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', async () => {
    if (browser) await browser.close();
});

export async function checkSnapshots(config: Config) {
    copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
    removeDynamicImports(SANDBOX_DEST);
    const hostUrl = `http://${config.angularCliHost}:${config.angularCliPort}`;
    writeSandboxesToTest(config, hostUrl);
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

    // TODO pass update snapshots flag
    const argv = {
      config: 'node_modules/angular-playground/jest/jest-puppeteer.config.js',
    } as JestConfig.Argv;
    const projectPath = resolvePath('.');
    const projects = [projectPath];
    console.log(argv, projects)
    const { results } = await runCLI(argv, projects);
    // console.log('RESULTS', results);

    await browser.close();
    process.exit(results.numFailedTests === 0 ? 0 : 1);
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

function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

function removeDynamicImports(sandboxPath: string) {
    const data = readFileSync(sandboxPath, 'utf-8');
    const dataArray = data.split('\n');
    const getSandboxIndex = dataArray.findIndex(val => val.includes('getSandbox(path)'));
    const result = dataArray.slice(0, getSandboxIndex).join('\n');
    writeFileSync(sandboxPath, result, { encoding: 'utf-8' });
}

function writeSandboxesToTest(config: Config, hostUrl: string) {
    const absoluteSnapshotDirectory = resolvePath('.', config.snapshotDirectory);
    try {
        const items = require(SANDBOX_DEST).getSandboxMenuItems();
        const testPaths = items.reduce((prev, curr) => {
          const paths = curr.scenarioMenuItems
            .map((scenarioItem) => ({
              url: `${encodeURIComponent(curr.key)}/${encodeURIComponent(scenarioItem.description)}`,
              label: `${curr.name} ${scenarioItem.description}`,
            }));
          prev.push(...paths);
          return prev;
        }, []);
        const result = `
          const tests = ${JSON.stringify(testPaths)};
          describe('Playground snapshot tests', () => {
            for (const test of tests) {
              it('should match ' + test.label, async () => {
                const url = \`${hostUrl}?scenario=\${test.url}\`
                await page.goto(url);
                const image = await page.screenshot();
                expect(image).toMatchImageSnapshot({
                  customSnapshotsDir: '${absoluteSnapshotDirectory}',
                });
              });
            }
          });
        `;
        writeFileSync(TEST_PATH, result, { encoding: 'utf-8' });
    } catch (err) {
        throw new Error(`Failed to create snapshot tests. ${err}`);
    }
}
