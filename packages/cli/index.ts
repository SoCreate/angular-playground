#!/usr/bin/env node
import * as program from 'commander';
import { configure, Config } from './src/configure';
import { buildSandboxes } from './src/build-sandboxes';
import { startWatch } from './src/start-watch';
import { runAngularCli } from './src/run-angular-cli';
import { verifySandboxes } from './src/verify-sandboxes';
import { findFirstFreePort } from './src/find-port';

(async () => {
    const config: Config = configure(process.argv);
    await buildSandboxes(config.sourceRoot, config.noChunk);

    if (config.verifySandboxes) {
        config.angularCliPort = await findFirstFreePort('127.0.0.1', 7000, 9000);
    }

    if (!config.noWatch || config.verifySandboxes) {
        startWatch(config.sourceRoot, () => buildSandboxes(config.sourceRoot, config.noChunk));
    }

    if (!config.noServe || config.verifySandboxes) {
        runAngularCli(config);
    }

    if (config.verifySandboxes) {
        verifySandboxes(config);
    }
})();
