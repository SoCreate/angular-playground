import { Configuration } from './shared/configuration';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

export const runAngularCli = (config: Configuration, angularCliConfig: any) => {
    const cliConfig = config.flags.angularCli;
    let args = [cliConfig.cmdPath.value, 'serve', '-no-progress'];
    args.push('--port');
    args.push(cliConfig.port.value.toString());
    if (cliConfig.appName.value) {
        args.push(`-a=${cliConfig.appName.value}`);
    }
    if (cliConfig.environment.value) {
        args.push(`-e=${cliConfig.environment.value}`);
    }
    if (angularCliConfig.args) {
        args = args.concat(angularCliConfig.args);
    }
    const ngServe = childProcess.spawn('node', args, { maxBuffer: 1024 * 500 });
    ngServe.stdout.on('data', (data) => {
        write(process.stdout, data);
    });
    ngServe.stderr.on('data', (data) => {
        write(process.stderr, data);
    });

    function write(handler, data) {
        let message = data.toString();
        handler.write(`[ng serve]: ${message}\n`);
    }
};
