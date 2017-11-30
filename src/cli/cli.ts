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
    const config = new Configuration(rawArgs);
    let sandboxPort, playgroundConfig;

    let configFile = path.resolve(config.flags.config.value);
    try {
        playgroundConfig = require(configFile.replace(/.json$/, ''));
    } catch (e) {
        process.stdout.write(`[angular-playground]: \x1b[31mFailed to load config file ${configFile}\x1b[0m\n`);
        process.exit(1);
    }

    // Parity between command line arguments and configuration file
    config.applyConfigurationFile(playgroundConfig);
    const sandboxesPath = await build(playgroundConfig.sourceRoot);
    console.log(config)

    if (config.flags.checkErrors.value) {
        // get port dynamically
        const port = await findFirstFreePort('127.0.0.1', 7000, 9000);
        sandboxPort = port;
        config.flags.angularCli.port.value = port;
    }

    if (!config.flags.noWatch.value) {
        startWatch(config.flags.sourceRoot.value, () => build(config.flags.sourceRoot.value));
    }

    if (!config.flags.noServe.value && playgroundConfig.angularCli) {
        runAngularCli(config, playgroundConfig.angularCli);
    }

    if (config.flags.checkErrors.value) {
        verifySandboxes(config, sandboxesPath, sandboxPort);
    }
}
