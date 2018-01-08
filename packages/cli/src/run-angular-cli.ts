import chalk from 'chalk';
import { spawn, SpawnOptions } from 'child_process';
import { Config } from './apply-configuration-file';

export function runAngularCli(config: Config) {
    const args = configureArguments(config);
    const ngServe = spawn('node', args);

    const write = (handler: any, data: any) => {
        const message = data.toString();
        handler.write(`[ng serve]: ${message}\n`);
    };

    ngServe.stdout.on('data', data => write(process.stdout, data));
    ngServe.stderr.on('data', data => write(process.stderr, data));
}

function configureArguments(config: Config) {
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
