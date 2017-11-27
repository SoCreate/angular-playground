import * as puppeteer from 'puppeteer';
import * as process from 'process';
import * as path from 'path';
import { getParsedArguments } from '../shared/parser';

// TODO: Update usage documentation
// TODO: Doc comments

interface ScenarioSummary {
    url: string;
    name: string;
    description: string;
}

class Configuration {
    public chromeArguments = [
        '--disable-gpu',
        '--no-sandbox'
    ];

    constructor (
        public sandboxPath: string,
        public buildMode: boolean,
        public port: number,
    ) {}

    get baseUrl(): string {
        return `http://localhost:${this.port}`;
    }
}

// Parse command line input
const supportedFlages = ['--path', '--build', '--port'];
const parameters = process.argv;
const parsedArguments = getParsedArguments(supportedFlages, parameters);

let browser: any;
let currentScenario = '';

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
    const port = portArg ? parseInt(getArgumentValue(portArg), 10) : 8002;

    return new Configuration(sandboxLocation, buildMode, port);
}

async function main (configuration: Configuration) {
    browser = await puppeteer.launch({
        headless: true,
        handleSIGINT: false,
        args: configuration.chromeArguments
    });

    const scenarios = getSandboxMetadata(configuration.baseUrl, configuration.buildMode, configuration.sandboxPath);
    console.log(`Retrieved ${scenarios.length} scenarios.\n`);
    for (let i = 0; i < scenarios.length; i++) {
        await work(scenarios[i]);
    }

    browser.close();
}

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

function loadSandboxMenuItems(path: string) {
    try {
        return require(path).getSandboxMenuItems();
    } catch (err) {
        console.error('Failed to load sandboxes.ts file.');
        console.error(err);
        console.log('Terminating process.');
        process.exit(1);
    }
}

async function work(scenario: ScenarioSummary) {
    const page = await browser.newPage();
    page.on('console', (msg: any) => onConsoleErr(msg));
    currentScenario = scenario.name;
    await page.goto(scenario.url);
    console.log(`Checking: ${currentScenario}: ${scenario.description}`);
    await page.close();
}

function onConsoleErr(msg: any) {
    if (msg.type === 'error') {
        console.error(`ERROR Found in ${currentScenario}`);
        browser.close();
        process.exit(1);
    }
}

// Returns a random value between 1 and the provided length.
// Note: indexing of keys starts at 1, not 0
function getRandomKey(menuItemsLength: number): number {
    return Math.floor(Math.random() * (menuItemsLength - 1) + 1);
}

function getArgumentValue(argument: string) {
    return argument.split('=')[1];
}
