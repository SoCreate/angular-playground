import { fromDir } from './from-dir';
import { StringBuilder } from './string-builder';
import * as fs from 'fs';
import * as path from 'path';

export const build = (rootPath) => {
  let importStatements = new StringBuilder();
  let content = new StringBuilder();

  let modules = [];
  try{
    fs.accessSync(path.resolve('node_modules/@angular/animations'));
    importStatements.addLine(`import { BrowserAnimationsModule } from '@angular/platform-browser/animations';`);
    modules.push('BrowserAnimationsModule');
  } catch (e) {
  }
  content.addLine(`export const PLAYGROUND_SUPPORT_MODULES: any[] = [${modules.join(',')}];`);


  let home = path.resolve(rootPath);
  let sandboxCount = 0;
  let sandboxes = [];
  fromDir(home, /\.sandbox.ts$/, (filename) => {
    let filePathToUse = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
    let importName = `s${++sandboxCount}`;
    sandboxes.push(importName);
    importStatements.addLine(`import { default as ${importName} } from '${filePathToUse}';`);
  });
  content.addLine(`export let sandboxes: any[] = [];`);
  sandboxes.forEach(importName => {
    content.addLine(`sandboxes.push(${importName}.serialize());`);
  });

  let filePath = path.resolve(home, './sandboxes.ts');
  fs.writeFile(filePath, importStatements.dump() + content.dump(), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`Created file: ${filePath}`);
  });
};
