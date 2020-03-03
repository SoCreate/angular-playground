import * as getPort from 'get-port';
import { configure, Config } from './configure';
import { buildSandboxes } from './build-sandboxes';
import { startWatch } from './start-watch';
import { verifySandboxes } from './check-errors/verify-sandboxes';
import { serveAngularCli } from './serve-angular-cli';
import { buildAngularCli } from './build-angular-cli';
import { checkSnapshots } from './check-snapshots';

export async function run() {
    const config: Config = configure(process.argv);

    try {
        await buildSandboxes(config.sourceRoots, config.chunk, config.verifySandboxes || config.checkVisualRegressions);
    } catch (err) {
        throw err;
    }

    if (config.build || config.buildWithServiceWorker) {
        return await buildAngularCli(config.angularAppName, !!config.buildWithServiceWorker, config.baseHref, config.angularCliMaxBuffer);
    }

    if (config.verifySandboxes || (config.checkVisualRegressions && !config.deleteSnapshots)) {
        config.angularCliPort = await getPort({ host: config.angularCliHost });
    }

    if ((config.watch && !config.deleteSnapshots) || config.verifySandboxes || (config.checkVisualRegressions && !config.deleteSnapshots)) {
        startWatch(config.sourceRoots, () => buildSandboxes(config.sourceRoots, config.chunk));
    }

    if ((config.serve && !config.deleteSnapshots) || config.verifySandboxes || (config.checkVisualRegressions && !config.deleteSnapshots)) {
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

    if (config.checkVisualRegressions) {
      try {
          await checkSnapshots(config);
      } catch (err) {
          throw err;
      }
  }
}
