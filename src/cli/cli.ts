#! /usr/bin/env node
const path = require('path');
import { build } from './build';
import { startWatch } from './start-watch';
import { runAngularCli } from './run-angular-cli';

let configFile = path.resolve(process.argv[2]);
let config;
if (configFile) {
  config = require(configFile.replace(/.json$/, ''));
} else {
  config = {
    sourceRoot: './'
  }
}

build(config.sourceRoot);
startWatch(config, () => build(config.sourceRoot));
if (config.angularCli) {
  runAngularCli(config.angularCli);
}
