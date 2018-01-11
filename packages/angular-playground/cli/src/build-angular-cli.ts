import chalk from 'chalk';
import { exec } from 'child_process';
import { join as joinPath } from 'path';

export async function buildAngularCli(appName: string) {
    try {
        // Check package is installed locally
        require.resolve('@angular/service-worker');

        const playgroundIndex = getAppIndex(appName);
        await toggleServiceWorker(playgroundIndex);

        console.log('Building with sandboxes...');
        // Cannot build w/ AOT due to runtime compiler dependency
        exec(`ng build -a=${appName} --prod --aot=false`, (err, stdout, stderr) => {
            if (err) throw err;
            console.log(stdout);
        });
    } catch (err) {
        console.error(chalk.red('Error: --build requires @angular/service-worker to be installed locally.'));
        console.log('https://github.com/angular/angular-cli/wiki/build#service-worker');
        process.exit(1);
    }
}

function getAppIndex(appName: string): number {
    // Assumes .angular-cli.json is at root
    const cliFile = joinPath(process.cwd(), '.angular-cli.json').replace(/.json$/, '');
    const cliConfig = require(cliFile);

    return cliConfig.apps.findIndex(app => app.name === appName);
}

async function toggleServiceWorker(appIndex: number): Promise<any> {
    return new Promise((resolve, reject) => {
        exec(`ng set apps.${appIndex}.serviceWorker=true`, (err, stdout, stderr) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}
