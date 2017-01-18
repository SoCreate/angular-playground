"use strict";
var path = require('path');
var fs = require('fs');
exports.build = function (rootPath) {
    var home = path.resolve(rootPath);
    StringBuilder.addLine("let sandboxes = [];");
    var sandboxes = [];
    fromDir(home, /\.sandbox.ts$/, function (filename) {
        var filePathToUse = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
        sandboxes.push(filename);
        StringBuilder.addLine("sandboxes.push(require('" + filePathToUse + "').default.serialize());");
    });
    StringBuilder.addLine("export default sandboxes;");
    var filePath = path.resolve(home, './sandboxes.ts');
    fs.writeFile(filePath, StringBuilder.dump(), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Created file: " + filePath);
    });
};
var StringBuilder = (function () {
    function StringBuilder() {
    }
    StringBuilder.addLine = function (line) {
        StringBuilder.lines.push(line);
    };
    StringBuilder.dump = function () {
        var data = StringBuilder.lines.join('\n');
        StringBuilder.lines = [];
        return data;
    };
    StringBuilder.lines = [];
    return StringBuilder;
}());
var fromDir = function (startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); //recurse
        }
        else if (filter.test(filename))
            callback(filename);
    }
};
