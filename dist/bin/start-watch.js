"use strict";
var path = require('path');
var watch = require('node-watch');
exports.startWatch = function (config, cb) {
    var filter = function (fn) {
        return function (filename) {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };
    watch([path.resolve(config.sourceRoot)], filter(cb));
};
