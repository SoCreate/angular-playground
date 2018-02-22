import chalk from 'chalk';
import { spawn, SpawnOptions, ChildProcess } from 'child_process';
import { Config } from './configure';

export async function serveAngularCli(config: Config) {
    let args: string[];

    try {
        args = configureArguments(config);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }

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

function configureArguments(config: Config): string[] {
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
