import * as puppeteer from 'puppeteer';
import * as process from 'process';
import { getParsedArguments, getArgumentValue } from '../shared/parser';

// TODO: Update Docs!

class Configuration {
    constructor (
        public path: string,
        public build: boolean,
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

const chromeArguments = [
    '--disable-gpu',
    '--no-sandbox'
];

let browser: any;
let currentScenario = '';

// Ensure Chromium instances are destroyed on err
process.on('unhandledRejection', () => {
    if (browser) browser.close();
});


// const cmd_args = process.argv.filter(arg => arg.includes('--'));
// const sandboxesPath = cmd_args[0].substring('--path='.length, cmd_args[0].length);
// const selectRandomScenario = cmd_args[1] === '--build';


// const BASE_URL = 'http://localhost:8002/';
// let currentScenario = '';
// let browser;

// // Ensure Chromium instances are destroyed
// process.on('unhandledRejection', () => {
//     if (browser) {
//         browser.close();
//     }
// });

(async () => {
    const configuration = configure(parsedArguments.flags);
    // await main();
})();


/////////////////////////////////

// interface ScenarioSummary {
//     url: string;
//     name: string;
//     description: string;
// }

// async function main () {
//     browser = await puppeteer.launch({
//         headless: true,
//         handleSIGINT: false,
//         args
//     });

//     const scenarios = getSandboxMetadata(selectRandomScenario);
//     console.log(`Retrieved ${scenarios.length} scenarios.\n`);
//     for (let i = 0; i < scenarios.length; i++) {
//         await work(scenarios[i]);
//     }

//     browser.close();
// }

function configure(flags: string[]): Configuration {
    const pathArg = flags.find(f => f.includes('--path'));
    const portArg = flags.find(f => f.includes('--port'));

    if (!pathArg) {
        console.error('Please specify the path to sandboxes.ts');
        process.exit(1);
    }

    const path = getArgumentValue(pathArg);
    const buildMode = flags.indexOf('--build') !== -1;
    const port = portArg ? parseInt(getArgumentValue(portArg), 10) : 8002;

    return new Configuration(path, buildMode, port);
}

// function getSandboxMetadata(randomScenario) {
//     const scenarios: ScenarioSummary[] = [];

//     loadSandboxMenuItems(sandboxesPath).forEach(scenario => {
//         if (randomScenario) {
//             // Pick a random scenario for each component
//             const randomItemKey = getRandomKey(scenario.scenarioMenuItems.length);
//             scenario.scenarioMenuItems
//                 .forEach(item => {
//                     if (item.key === randomItemKey) {
//                         const url = `${BASE_URL}?scenario=${encodeURIComponent(scenario.key)}/${encodeURIComponent(item.description)}`;
//                         scenarios.push({ url, name: scenario.key, description: item.description });
//                     }
//                 });
//         } else {
//             // Grab all scenarios
//             scenario.scenarioMenuItems
//                 .forEach(item => {
//                     const url = `${BASE_URL}?scenario=${encodeURIComponent(scenario.key)}/${encodeURIComponent(item.description)}`;
//                     scenarios.push({ url, name: scenario.key, description: item.description });
//                 });
//         }
//     });

//     return scenarios;
// }

// function loadSandboxMenuItems(path: string) {
//     try {
//         return require(path).getSandboxMenuItems();
//     } catch (err) {
//         console.error('Failed to load sandboxes.ts file.');
//         console.error(err);
//         console.log('Terminating process.');
//         process.exit(1);
//     }
// }

// async function work (scenario) {
//     const page = await browser.newPage();
//     page.on('console', msg => onConsoleErr(msg));
//     currentScenario = scenario.name;
//     await page.goto(scenario.url);
//     console.log(`Checking: ${currentScenario}: ${scenario.description}`);
//     await page.close();
// }

// function onConsoleErr(msg) {
//     if (msg.type === 'error') {
//         console.error(`ERROR Found in ${currentScenario}`);
//         browser.close();
//         process.exit(1);
//     }
// }

// // Returns a random value between 1 and the provided length.
// // Note: indexing of keys starts at 1, not 0
// function getRandomKey(menuItemsLength) {
//     return Math.floor(Math.random() * (menuItemsLength - 1) + 1);
// }
