import chalk from 'chalk';
import { exec, spawn, SpawnOptions, ChildProcess } from 'child_process';
import { Config } from './configure';

export async function runAngularCli(config: Config) {
    const args: string[] = await configureArguments(config);
    const ngServe = spawn('node', args);

    const write = (handler: any, data: any) => {
        const message = data.toString();
        handler.write(`[ng serve]: ${message}\n`);
    };

    ngServe.stdout.on('data', data => {
        write(process.stdout, data);
    });

    ngServe.stderr.on('data', data => {
        write(process.stderr, data);
    });
}

async function configureArguments(config: Config): Promise<string[]> {
    if (config.buildWithServiceWorkers) {
        try {
            console.log(require.resolve('@angular/service-worker'));
            await toggleServiceWorker();
            return [config.angularCliPath, 'build', '--prod'];
        } catch (err) {
            console.error(chalk.red('Error: --build requires @angular/service-worker to be installed locally.'));
            console.log('https://github.com/angular/angular-cli/wiki/build#service-worker');
            process.exit(1);
        }
    }

    let args = [config.angularCliPath, 'serve', '-no-progress'];

    args.push(`--port=${config.angularCliPort}`);

    if (config.angularAppName) {
        args.push(`-a=${config.angularAppName}`);
    } else {
        throw new Error(chalk.red('Please provide Playground\'s appName in your angular-playground.json file.'));
    }

    if (config.angularCliEnv) {
        args.push(`-e=${config.angularCliEnv}`);
    }

    if (config.angularCliAdditionalArgs) {
        args = args.concat(config.angularCliAdditionalArgs);
    }

    return args;
}

function toggleServiceWorker(): Promise<any> {
    return new Promise((resolve, reject) => {
        exec('ng set apps.0.serviceWorker=true', (err, stdout, stderr) => {
            if (err) reject(err);
            resolve(stdout);
        });
    });
}
