import { exec } from 'child_process';

export async function buildAngularCli(appName: string, enableServiceWorker: boolean, baseHref: string, maxBuffer: number | string) {
    let isInstalled = await serviceWorkerIsInstalled();
    if (enableServiceWorker && !isInstalled) {
        throw new Error('\n\nError: --build-with-service-worker requires @angular/service-worker to be installed locally: \n' +
        'try running "npm install @angular/service-worker" then run "angular-playground --build" \n' +
        'see docs: https://github.com/angular/angular-cli/wiki/build#service-worker\n\n');
    }

    console.log('Building for production with sandboxes...');

    const options = Number.isInteger(+maxBuffer) ? { maxBuffer: +maxBuffer } : {};
    // Cannot build w/ AOT due to runtime compiler dependency
    const flags = [
        '--prod',
        '--aot=false',
        `--base-href=${baseHref}`,
        `--service-worker=${enableServiceWorker}`,
    ];
    exec(`ng build ${appName} ${flags.join(' ')}`,
        options,
        (err, stdout, stderr) => {
            if (err) throw err;
            console.log(stdout);
        });
}

async function serviceWorkerIsInstalled(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            // Check package is installed (prod)
            require.resolve('@angular/service-worker');
            resolve(true);
        } catch (err) {
            try {
                // Check package is installed (dev)
                require.resolve('../../../../../examples/cli-example/node_modules/@angular/service-worker');
                resolve(true);
            } catch (err2) {
                resolve(false);
            }
        }
    });
}
