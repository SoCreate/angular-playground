const path = require('path');
import {build} from './build';
import {startWatch} from './start-watch';
import {runAngularCli} from './run-angular-cli';

export async function runPlayground() {
  const supportedFlags = ['-no-watch', '-no-serve'];
  let args = process.argv.slice(2);
  let flags = [];
  args = args.reduce((accr, value) => {
    supportedFlags.indexOf(value) > -1 ? flags.push(value) : accr.push(value);
    return accr;
  }, []);

  const runWatch = flags.indexOf('-no-watch') === -1;
  const runAngularCliServe = flags.indexOf('-no-serve') === -1;

  // TODO: Support multiple arguments (for verification)
  const configFilePath = args[0] || 'angular-playground.json';

  let configFile = path.resolve(configFilePath);
  let config;
  try {
    config = require(configFile.replace(/.json$/, ''));
  } catch(e) {
    process.stdout.write(`[angular-playground]: \x1b[31mFailed to load config file ${configFile}\x1b[0m\n`);
    process.exit(1);
  }

  await build(config.sourceRoot);
  if (runWatch) {
    startWatch(config, () => build(config.sourceRoot));
  }
  if (runAngularCliServe && config.angularCli) {
    runAngularCli(config.angularCli);
  }
}
