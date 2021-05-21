import * as puppeteer from 'puppeteer';
import chalk from 'chalk';
import { ConsoleMessage, Page } from 'puppeteer';
import { SANDBOX_MENU_ITEMS_FILE, SandboxFileInformation } from '../build-sandboxes';
import { ErrorReporter, REPORT_TYPE } from '../error-reporter';
import { Config } from '../configure';
import { waitForNgServe } from '../utils';

// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = ['--disable-gpu', '--no-sandbox'];


export interface ScenarioSummary {
    name: string;
    description: string;
    sandboxKey: string;
    scenarioKey: number;
}

let browser: puppeteer.Browser;
let currentScenario = '';
let currentScenarioDescription = '';
let reporter: ErrorReporter;

// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', async () => {
    if (browser) { await browser.close(); }
});

export async function verifySandboxes(config: Config) {
    await main(config);
}

/////////////////////////////////

async function main(config: Config) {
    const hostUrl = `http://localhost:${config.angularCliPort}`;
    const timeoutAttempts = config.timeout;
    browser = await puppeteer.launch({
        headless: true,
        handleSIGINT: false,
        args: CHROME_ARGS,
    });

    await waitForNgServe(browser, hostUrl, timeoutAttempts);

    const scenarios = getSandboxMetadata(config, hostUrl, config.randomScenario);
    console.log(`Retrieved ${scenarios.length} scenarios.\n`);

    reporter = new ErrorReporter(scenarios, config.reportPath, config.reportType);
    const page = await setupPageAndErrorHandling(hostUrl);
    for (let i = 0; i < scenarios.length; i++) {
        console.log(`Checking [${i + 1}/${scenarios.length}]: ${scenarios[i].name}: ${scenarios[i].description}`);
        await openScenario(scenarios[i], page);
    }
    await page.close();
    await browser.close();

    const hasErrors = reporter.errors.length > 0;
    // always generate report if report type is a file, or if there are errors
    if (hasErrors || config.reportType !== REPORT_TYPE.LOG) {
        reporter.compileReport();
    }
    const exitCode = hasErrors ? 1 : 0;
    process.exit(exitCode);
}

async function setupPageAndErrorHandling(hostUrl): Promise<Page> {
    const page = await browser.newPage();
    page.on('console', (msg: ConsoleMessage) => onConsoleErr(msg));
    await page.goto(hostUrl);
    return page;
}

async function openScenario(scenario: ScenarioSummary, page: Page) {
    currentScenario = scenario.name;
    currentScenarioDescription = scenario.description;

    // @ts-ignore
    await page.evaluate((sandboxKey, scenarioKey) => window.loadScenario(sandboxKey, scenarioKey),
        scenario.sandboxKey, scenario.scenarioKey);
    // @ts-ignore
    await page.waitForFunction(() => window.isPlaygroundComponentLoaded() || window.isPlaygroundComponentLoadedWithErrors());

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    await sleep(100); // sleep for a bit in case page elements are still being rendered
}

/**
 * Retrieves Sandbox scenario URLs, descriptions, and names
 * @param config - Configuration
 * @param baseUrl - Base URL of scenario path e.g. http://localhost:4201
 * @param selectRandomScenario - Whether or not to select one random scenario of all availalble scenarios for a component
 */
function getSandboxMetadata(config: Config, baseUrl: string, selectRandomScenario: boolean): ScenarioSummary[] {
    const scenarios: ScenarioSummary[] = [];

    loadSandboxMenuItems().forEach((sandboxItem: SandboxFileInformation) => {
        if (!config.pathToSandboxes || config.pathToSandboxes.some(vp => sandboxItem.key.includes(vp))) {
            if (selectRandomScenario) {
                const randomItemKey = getRandomKey(sandboxItem.scenarioMenuItems.length);
                for (const item of sandboxItem.scenarioMenuItems) {
                    if (item.key === randomItemKey) {
                        scenarios.push(
                            {
                                name: sandboxItem.key,
                                description: item.description,
                                sandboxKey: sandboxItem.key,
                                scenarioKey: item.key
                            }
                        );
                        break;
                    }
                }
            } else {
                // Grab all scenarios
                sandboxItem.scenarioMenuItems
                    .forEach((item) => {
                        scenarios.push(
                            {
                                name: sandboxItem.key,
                                description: item.description,
                                sandboxKey: sandboxItem.key,
                                scenarioKey: item.key
                            }
                        );
                    });
            }
        }
    });

    return scenarios;
}

/**
 * Attempt to load sandboxes.ts and provide menu items
 */
function loadSandboxMenuItems(): SandboxFileInformation[] {
    try {
        return require(SANDBOX_MENU_ITEMS_FILE).getSandboxMenuItems();
    } catch (err) {
        throw new Error(`Failed to load sandbox menu items. ${err}`);
    }
}

/**
 * Callback when Chromium page encounters a console error
 */
function onConsoleErr(msg: ConsoleMessage) {
    if (msg.type() === 'error') {
        console.error(chalk.red(`Error in ${currentScenario} (${currentScenarioDescription}):`));
        const getErrors = (type: string, getValue: (_: any) => string) => msg.args()
            .map(a => (a as any)._remoteObject)
            .filter(o => o.type === type)
            .map(getValue);
        const stackTrace = getErrors('object', o => o.description);
        const errorMessage = getErrors('string', o => o.value);
        const description = stackTrace.length ? stackTrace : errorMessage;
        description.map(d => console.error(d));
        if (description.length) {
            reporter.addError(description, currentScenario, currentScenarioDescription);
        }
    }
}

/**
 * Returns a random value between 1 and the provided length (both inclusive).
 * Note: indexing of keys starts at 1, not 0
 */
function getRandomKey(menuItemsLength: number): number {
    return Math.floor(Math.random() * menuItemsLength) + 1;
}
