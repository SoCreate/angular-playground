import * as puppeteer from 'puppeteer';
import * as process from 'process';
import * as path from 'path';
import { ErrorReporter, ReportType } from './shared/error-reporter';
import { Configuration } from './shared/configuration';
// ts-node required for runtime typescript compilation of sandboxes.ts
require('ts-node/register');


interface ScenarioSummary {
    url: string;
    name: string;
    description: string;
}

let browser: any;
let currentScenario = '';
const reporter = new ErrorReporter();
let hostUrl = '';

// Ensure Chromium instances are destroyed on err
process.on('unhandledRejection', () => {
    if (browser) browser.close();
});

export async function verifySandboxes(configuration: Configuration, sandboxesPath: string, port: number) {
    hostUrl = `localhost:${port}`;
    await main(configuration, sandboxesPath, port);
}

/////////////////////////////////

async function main (configuration: Configuration, sandboxesPath: string, port: number) {
    const timeoutAttempts = configuration.flags.timeout.value;
    browser = await puppeteer.launch({
        headless: true,
        handleSIGINT: false,
        args: configuration.chromeArguments
    });

    const scenarios = getSandboxMetadata(hostUrl, configuration.flags.randomScenario.value, sandboxesPath);
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
 * @param scenario - Scenario to visit
 */
async function openScenarioInNewPage(scenario: ScenarioSummary, timeoutAttempts: number) {
    if (timeoutAttempts === 0) {
        await browser.close();
        process.exit(1);
    }

    const page = await browser.newPage();
    page.on('console', (msg: any) => onConsoleErr(msg));
    currentScenario = scenario.name;

    try {
        console.log('attempting to hit page');
        console.log(scenario.url);
        await page.goto(scenario.url);
    } catch (e) {
        console.log('closing page')
        await page.close();
        console.log('beginning delay')
        await delay(1000);
        console.log('running again')
        await openScenarioInNewPage(scenario, timeoutAttempts - 1);
    }
}

/**
 * Retrieves Sandbox scenario URLs, descriptions, and names
 * @param baseUrl - Base URL of scenario path e.g. http://localhost:4201
 * @param selectRandomScenario - Whether or not to select one random scenario of all availalble scenarios for a component
 * @param path - Path to sandboxes.ts
 */
function getSandboxMetadata(baseUrl: string, selectRandomScenario: boolean, path: string): ScenarioSummary[] {
    const scenarios: ScenarioSummary[] = [];

    loadSandboxMenuItems(path).forEach((scenario: any) => {
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
 * Attemtp to load sandboxes.ts and provide menu items
 * @param path - Path to sandboxes.ts
 */
function loadSandboxMenuItems(path: string): any[] {
    try {
        return require(path).getSandboxMenuItems();
    } catch (err) {
        console.error('Failed to load sandboxes.ts file.');
        console.error(err);
        console.log('Terminating process.');
        process.exit(1);
    }
}

/**
 * Callback when Chromium page encounters a console error
 * @param msg - Error message
 */
function onConsoleErr(msg: any) {
    if (msg.type === 'error') {
        console.error(`ERROR Found in ${currentScenario}`);
        reporter.addError(msg, currentScenario);
    }
}

/**
 * Returns a random value between 1 and the provided length.
 * Note: indexing of keys starts at 1, not 0
 * @param menuItemsLength - Maximum number of items
 */
function getRandomKey(menuItemsLength: number): number {
    return Math.floor(Math.random() * (menuItemsLength - 1) + 1);
}

function delay(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
