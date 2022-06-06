import { spawn } from 'child_process';
import { Config } from './configure';

export async function serveAngularCli(config: Config) {
    const args = configureArguments(config);
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

    return Promise.resolve();
}

function configureArguments(config: Config): string[] {
    let args = [config.angularCliPath, 'serve', config.angularAppName];

    if (!config.angularAppName) {
        throw new Error(`Please provide Playground's appName in your angular-playground.json file.`);
    }
    args.push(`--host=${config.angularCliHost}`);
    args.push(`--port=${config.angularCliPort}`);
    // need to set webpack.devServer.public via ng serve --publicHost flag (https://stackoverflow.com/a/43621275)

    if (config.angularCliAdditionalArgs) {
        args = args.concat(config.angularCliAdditionalArgs);
    }
    return args;
}
