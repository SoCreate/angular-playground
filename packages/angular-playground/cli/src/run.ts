import * as getPort from 'get-port';
import { configure, Config } from './configure';
import { buildSandboxes } from './build-sandboxes';
import { startWatch } from './start-watch';
import { verifySandboxes } from './check-errors/verify-sandboxes';
import { serveAngularCli } from './serve-angular-cli';
import { buildAngularCli } from './build-angular-cli';

export async function run() {
    const config: Config = configure(process.argv);

    try {
        await buildSandboxes(config.sourceRoots, config.chunk);
    } catch (err) {
        throw err;
    }

    if (config.buildWithServiceWorkers) {
        return await buildAngularCli(config.angularAppName, config.baseHref, config.angularCliMaxBuffer);
    }

    if (config.verifySandboxes) {
        config.angularCliPort = await getPort({ host: '127.0.0.1' });
    }

    if (config.watch || config.verifySandboxes) {
        startWatch(config.sourceRoots, () => buildSandboxes(config.sourceRoots, config.chunk));
    }

    if (config.serve || config.verifySandboxes) {
        try {
            await serveAngularCli(config);
        } catch (err) {
            throw err;
        }
    }

    if (config.verifySandboxes) {
        try {
            await verifySandboxes(config);
        } catch (err) {
            throw err;
        }
    }
}
