import * as puppeteer from 'puppeteer';
import * as process from 'process';
import * as path from 'path';
import { getParsedArguments } from '../shared/parser';
import { Configuration, ScenarioSummary, ErrorReporter } from './state';

// Parse command line input
const supportedFlages = ['--path', '--build', '--port'];
const parameters = process.argv;
const parsedArguments = getParsedArguments(supportedFlages, parameters);

let browser: any;
let currentScenario = '';
const reporter = new ErrorReporter();

// Ensure Chromium instances are destroyed on err
process.on('unhandledRejection', () => {
    if (browser) browser.close();
});

(async () => {
    const configuration = configure(parsedArguments.flags);
    await main(configuration);
})();


/////////////////////////////////

function configure(flags: string[]): Configuration {
    const pathArg = flags.find(f => f.includes('--path'));
    const portArg = flags.find(f => f.includes('--port'));

    if (!pathArg) {
        console.error('Please specify the path to sandboxes.ts');
        process.exit(1);
    }

    const sandboxLocation = path.join(process.cwd(), getArgumentValue(pathArg));
    const buildMode = flags.indexOf('--build') !== -1;
    const port = portArg ? parseInt(getArgumentValue(portArg), 10) : 4201;

    return new Configuration(sandboxLocation, buildMode, port);
}

async function main (configuration: Configuration) {
    let timeoutAttempts = configuration.timeoutAttempts;
    browser = await puppeteer.launch({
        headless: true,
        handleSIGINT: false,
        args: configuration.chromeArguments
    });

    const scenarios = getSandboxMetadata(configuration.baseUrl, configuration.buildMode, configuration.sandboxPath);
    console.log(`Retrieved ${scenarios.length} scenarios.\n`);
    for (let i = 0; i < scenarios.length; i++) {
        await openScenarioInNewPage(scenarios[i], configuration.timeoutAttempts);
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
 * Creates a Chromium page and navigates to a scenario (URL)
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
        await page.goto(scenario.url);  await page.goto(scenario.url);
    } catch (e) {
        console.log(`Attempting to connect. (Attempts Remaining ${timeoutAttempts})`);
        await openScenarioInNewPage(scenario, timeoutAttempts - 1);
    }

    console.log(`Checking: ${currentScenario}: ${scenario.description}`);
    await page.close();
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

/**
 * Separates value of an argument from its flag
 * @param argument - Flag with value e.g. --path=./src/
 */
function getArgumentValue(argument: string) {
    return argument.split('=')[1];
}
