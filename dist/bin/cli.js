#! /usr/bin/env node
"use strict";
var path = require('path');
var build_1 = require('./build');
var start_watch_1 = require('./start-watch');
var run_angular_cli_1 = require('./run-angular-cli');
var configFile = path.resolve(process.argv[2]);
var config;
if (configFile) {
    config = require(configFile.replace(/.json$/, ''));
}
else {
    config = {
        sourceRoot: './'
    };
}
build_1.build(config.sourceRoot);
start_watch_1.startWatch(config, function () { return build_1.build(config.sourceRoot); });
if (config.angularCli) {
    run_angular_cli_1.runAngularCli(config.angularCli);
}
