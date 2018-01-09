import * as program from 'commander';
import { configure, Config } from './configure';
import { buildSandboxes } from './build-sandboxes';
import { startWatch } from './start-watch';
import { runAngularCli } from './run-angular-cli';
import { verifySandboxes } from './verify-sandboxes';
import { findFirstFreePort } from './find-port';

export async function run() {
    const config: Config = configure(process.argv);
    await buildSandboxes(config.sourceRoot, config.chunk);

    if (config.verifySandboxes) {
        config.angularCliPort = await findFirstFreePort('127.0.0.1', 7000, 9000);
    }

    if (config.watch || config.verifySandboxes) {
        startWatch(config.sourceRoot, () => buildSandboxes(config.sourceRoot, config.chunk));
    }

    if (config.serve || config.verifySandboxes) {
        runAngularCli(config);
    }

    if (config.verifySandboxes) {
        verifySandboxes(config);
    }
}
