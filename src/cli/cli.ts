#! /usr/bin/env node
import * as path from 'path';
import { build } from './build';
import { startWatch } from './start-watch';
import { runAngularCli } from './run-angular-cli';
import { Configuration } from './shared/configuration';
import { verifySandboxes } from './verify-sandboxes';
import { findFirstFreePort } from './shared/find-port';

(async () => {
    await run();
})();

async function run() {
    const rawArgs = process.argv.slice(2);
    console.log(rawArgs);
    const config = new Configuration(rawArgs);
    let sandboxPort, playgroundConfig;

    // let configFile = path.resolve(config.switches.config.value);
    let configFile = path.resolve(config.flags.config.value);
    try {
        playgroundConfig = require(configFile.replace(/.json$/, ''));
    } catch (e) {
        process.stdout.write(`[angular-playground]: \x1b[31mFailed to load config file ${configFile}\x1b[0m\n`);
        process.exit(1);
    }

    // Parity between command line arguments and configuration file
    config.applyConfigurationFile(playgroundConfig);
    console.log(config);

    const sandboxesPath = await build(playgroundConfig.sourceRoot);

    if (config.flags.checkErrors.value) {
        // get port dynamically
        findFirstFreePort('127.0.0.1', 7000, 9000, port => {
            sandboxPort = port;
            playgroundConfig.angularCli.port = port;
        });
    }

    if (!config.flags.noWatch.value) {
        startWatch(playgroundConfig, () => build(playgroundConfig.sourceRoot));
    }

    if (!config.flags.noServe.value && playgroundConfig.angularCli) {
        runAngularCli(playgroundConfig.angularCli);
    }

    if (config.flags.checkErrors.value) {
        verifySandboxes(config, sandboxesPath, sandboxPort);
    }
}
