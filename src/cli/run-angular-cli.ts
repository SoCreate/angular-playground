import { Configuration } from './shared/configuration';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

export const runAngularCli = (config: Configuration, angularCliConfig: any) => {
    let args = [config.flags.ngCliCmdPath.value, 'serve', '-no-progress'];
    args.push('--port');
    args.push(config.flags.ngCliPort.value.toString());
    if (config.flags.ngCliApp.value) {
        args.push(`-a=${config.flags.ngCliApp.value}`);
    }
    if (config.flags.ngCliEnv.value) {
        args.push(`-e=${config.flags.ngCliEnv.value}`);
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
