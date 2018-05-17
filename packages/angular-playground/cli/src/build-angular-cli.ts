import { exec } from 'child_process';
import { join as joinPath } from 'path';

export async function buildAngularCli(appName: string, baseHref: string) {
    let isInstalled = await serviceWorkerIsInstalled();
    if (!isInstalled) {
        throw new Error('\n\nError: --build requires @angular/service-worker to be installed locally: \n' +
        `try running "npm install @angular/service-worker" then run "angular-playground --build" \n` +
        'see docs: https://github.com/angular/angular-cli/wiki/build#service-worker \n\n');
    }


    console.log('Building for production with sandboxes...');
    // Cannot build w/ AOT due to runtime compiler dependency
    exec(`ng build ${appName} --prod --aot=false --base-href=${baseHref}`, (err, stdout, stderr) => {
        if (err) throw err;
        console.log(stdout);
    });
}

async function serviceWorkerIsInstalled(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            // Check package is installed locally
            require.resolve('@angular/service-worker');
            resolve(true);
        } catch (err) {
            resolve(false);
        }
    });
}
