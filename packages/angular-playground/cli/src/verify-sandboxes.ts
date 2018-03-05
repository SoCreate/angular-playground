import puppeteer = require('puppeteer');
import { resolve as resolvePath } from 'path';
import chalk from 'chalk';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { ErrorReporter } from './error-reporter';
import { Config } from './configure';

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = [ '--disable-gpu', '--no-sandbox' ];
const SANDBOX_PATH = resolvePath(__dirname, '../../build/shared/sandboxes.js');
const SANDBOX_DEST = resolvePath(__dirname, '../../sandboxes_modified.js');

export interface ScenarioSummary {
    url: string;
    name: string;
    description: string;
}

let browser: any;
let currentScenario = '';
let reporter: ErrorReporter;
let hostUrl = '';

// Ensure Chromium instances are destroyed on err
process.on('unhandledRejection', () => {
    if (browser) browser.close();
});

export function verifySandboxes(config: Config) {
    hostUrl = `http://localhost:${config.angularCliPort}`;
    copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
    removeDynamicImports(SANDBOX_DEST);
    main(config);
}

/////////////////////////////////

async function main(config: Config) {
    const timeoutAttempts = config.timeout;
    browser = await puppeteer.launch({
        headless: true,
        handleSIGINT: false,
        args: CHROME_ARGS
    });

    const scenarios = getSandboxMetadata(hostUrl, config.randomScenario);

    reporter = new ErrorReporter(scenarios, config.reportPath, config.reportType);
    console.log(`Retrieved ${scenarios.length} scenarios.\n`);
    for (let i = 0; i < scenarios.length; i++) {
        console.log(`Checking: ${scenarios[i].name}: ${scenarios[i].description}`);
        await openScenarioInNewPage(scenarios[i], timeoutAttempts);
    }

    browser.close();

    if (reporter.errors.length > 0) {
        reporter.compileReport();
        process.exit(1);
    } else {
        process.exit(0);
    }
}

/**
 * Creates a Chromium page and navigates to a scenario (URL).
 * If Chromium is not able to connect to the provided page, it will issue a series
 * of retries before it finally fails.
 */
async function openScenarioInNewPage(scenario: ScenarioSummary, timeoutAttempts: number) {
    if (timeoutAttempts === 0) {
        await browser.close();
        throw new Error('Unable to connect to Playground.');
    }

    const page = await browser.newPage();
    page.on('console', (msg: any) => onConsoleErr(msg));
    currentScenario = scenario.name;

    try {
        await page.goto(scenario.url);
    } catch (e) {
        await page.close();
        await delay(1000);
        await openScenarioInNewPage(scenario, timeoutAttempts - 1);
    }
}

/**
 * Retrieves Sandbox scenario URLs, descriptions, and names
 * @param baseUrl - Base URL of scenario path e.g. http://localhost:4201
 * @param selectRandomScenario - Whether or not to select one random scenario of all availalble scenarios for a component
 */
function getSandboxMetadata(baseUrl: string, selectRandomScenario: boolean): ScenarioSummary[] {
    const scenarios: ScenarioSummary[] = [];

    loadSandboxMenuItems().forEach((scenario: any) => {
        if (selectRandomScenario) {
            const randomItemKey = getRandomKey(scenario.scenarioMenuItems.length);
            scenario.scenarioMenuItems
                .forEach((item: any) => {
                    if (item.key === randomItemKey) {
                        const url = `${baseUrl}?scenario=${encodeURIComponent(scenario.key)}/${encodeURIComponent(item.description)}`;
                        scenarios.push({ url, name: scenario.key, description: item.description });
                    }
                });
        } else {
            // Grab all scenarios
            scenario.scenarioMenuItems
                .forEach((item: any) => {
                    const url = `${baseUrl}?scenario=${encodeURIComponent(scenario.key)}/${encodeURIComponent(item.description)}`;
                    scenarios.push({ url, name: scenario.key, description: item.description });
                });
        }
    });

    return scenarios;
}

/**
 * Attempt to load sandboxes.ts and provide menu items
 */
function loadSandboxMenuItems(): any[] {
    try {
        return require(SANDBOX_DEST).getSandboxMenuItems();
    } catch (err) {
        console.log(chalk.red('Failed to load sandbox menu items.'));
        console.error(err);
        throw err;
    }
}

/**
 * Callback when Chromium page encounters a console error
 */
async function onConsoleErr(msg: any) {
    if (msg.type === 'error') {
        console.error(chalk.red(`Error in ${currentScenario}:`));
        const descriptions = msg.args
            .map(a => a._remoteObject)
            .filter(o => o.type === 'object')
            .map(o => o.description);
        descriptions.map(d => console.error(d));
        reporter.addError(descriptions, currentScenario);
    }
}

/**
 * Returns a random value between 1 and the provided length.
 * Note: indexing of keys starts at 1, not 0
 */
function getRandomKey(menuItemsLength: number): number {
    return Math.floor(Math.random() * (menuItemsLength - 1) + 1);
}

function removeDynamicImports(sandboxPath: string) {
    const data = readFileSync(sandboxPath, 'utf-8');
    const dataArray = data.split('\n');
    const getSandboxIndex = dataArray.findIndex(val => val.includes('getSandbox(path)'));
    const result = dataArray.slice(0, getSandboxIndex).join('\n');
    writeFileSync(sandboxPath, result, { encoding: 'utf-8' });
}

function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
