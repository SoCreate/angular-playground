const path = require('path');
const fs = require('fs');

export const build = (rootPath) => {
  let home = path.resolve(rootPath);
  let sandboxCount = 0;
  let sandboxes = [];
  fromDir(home, /\.sandbox.ts$/, (filename) => {
    let filePathToUse = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
    let importName = `s${++sandboxCount}`;
    sandboxes.push(importName);
    StringBuilder.addLine(`import { default as ${importName} } from '${filePathToUse}';`);
  });
  StringBuilder.addLine(`let sandboxes = [];`);
  sandboxes.forEach(importName => {
    StringBuilder.addLine(`sandboxes.push(${importName}.serialize());`);
  });
  StringBuilder.addLine(`export default sandboxes;`);

  let filePath = path.resolve(home, './sandboxes.ts');
  fs.writeFile(filePath, StringBuilder.dump(), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`Created file: ${filePath}`);
  });
};

class StringBuilder {
  static lines = [];

  static addLine(line) {
    StringBuilder.lines.push(line);
  }

  static dump() {
    let data = StringBuilder.lines.join('\n');
    StringBuilder.lines = [];
    return data;
  }
}

const fromDir = (startPath, filter, callback) => {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  let files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    let filename = path.join(startPath, files[i]);
    let stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter, callback); //recurse
    }
    else if (filter.test(filename)) callback(filename);
  }
};
