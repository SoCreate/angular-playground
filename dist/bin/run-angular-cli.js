"use strict";
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
exports.runAngularCli = function (angularCliConfig) {
    var port = angularCliConfig.port ? angularCliConfig.port : 4201;
    var args = ['node_modules/angular-cli/bin/ng', 'serve', '--progress=false'];
    args.push('--port');
    args.push(port.toString());
    if (angularCliConfig.environment) {
        args.push("-e=" + angularCliConfig.environment);
    }
    var ngServe = childProcess.spawn('node', args, { maxBuffer: 1024 * 500 });
    ngServe.stdout.on('data', function (data) {
        write(process.stdout, data);
    });
    ngServe.stderr.on('data', function (data) {
        write(process.stderr, data);
    });
    function write(handler, data) {
        var message = data.toString();
        handler.write("[ng serve]: " + message + "\n");
    }
};
