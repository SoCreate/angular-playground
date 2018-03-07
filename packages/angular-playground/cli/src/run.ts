import { configure, Config } from './configure';
import { buildSandboxes } from './build-sandboxes';
import { startWatch } from './start-watch';
import { verifySandboxes } from './check-errors/verify-sandboxes';
import { findFirstFreePort } from './check-errors/find-port';
import { serveAngularCli } from './serve-angular-cli';
import { buildAngularCli } from './build-angular-cli';

export async function run() {
    const config: Config = configure(process.argv);

    try {
        await buildSandboxes(config.sourceRoot, config.chunk);
    } catch (err) {
        throw err;
    }

    if (config.buildWithServiceWorkers) {
        return await buildAngularCli(config.angularAppName, config.baseHref);
    }

    if (config.verifySandboxes) {
        config.angularCliPort = await findFirstFreePort('127.0.0.1', 7000, 9000);
    }

    if (config.watch || config.verifySandboxes) {
        startWatch(config.sourceRoot, () => buildSandboxes(config.sourceRoot, config.chunk));
    }

    if (config.serve || config.verifySandboxes) {
        try {
            await serveAngularCli(config);
        } catch (err) {
            throw err;
        }
    }

    if (config.verifySandboxes) {
        verifySandboxes(config);
    }
}
