import { fromDir } from './from-dir';
import { StringBuilder } from './string-builder';
import * as fs from 'fs';
import * as path from 'path';

export const build = (rootPath) => {
  let importStatements = new StringBuilder();
  let content = new StringBuilder();
  let home = path.resolve(rootPath);
  let sandboxCount = 0;
  let sandboxes = [];
  fromDir(home, /\.sandbox.ts$/, (filename) => {
    let filePathToUse = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
    const contents = fs.readFileSync(filename, 'utf8');
    const match = / sandboxOf\(\s*([^)]+?)\s*\)/g.exec(contents);
    if (match) {
      const typeName = match[1].split(',')[0].trim();
      let importName = `s${++sandboxCount}`;
      sandboxes.push({importName, typeName});
      importStatements.addLine(`import { default as ${importName} } from '${filePathToUse}';`);
    }
  });
  content.addLine(`export let sandboxes: any[] = [];`);
  sandboxes.forEach(({importName, typeName}) => {
    content.addLine(`sandboxes.push(${importName}.serialize('${typeName}'));`);
  });

  let filePath = path.resolve(home, './sandboxes.ts');
  fs.writeFile(filePath, importStatements.dump() + content.dump(), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`Created file: ${filePath}`);
  });
};
