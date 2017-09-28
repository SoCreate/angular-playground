import { fromDir } from './from-dir';
import { StringBuilder } from './string-builder';
import * as fs from 'fs';
import * as path from 'path';

export const build = (rootPath) => {
  let content = new StringBuilder();
  let home = path.resolve(rootPath);
  let sandboxes = [];

  fromDir(home, /\.sandbox.ts$/, (filename) => {
    let sandboxPath = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
    const contents = fs.readFileSync(filename, 'utf8');

    const matchSandboxOf = /\s?sandboxOf\s*\(\s*([^)]+?)\s*\)/g.exec(contents);
    if (matchSandboxOf) {
      const typeName = matchSandboxOf[1].split(',')[0].trim();
      const labelText = /label\s*:\s*['"](.+)['"]/g.exec(matchSandboxOf[0]);

      let scenarioMenuItems = [];
      const scenarioRegex = /\.add\s*\(['"](.+)['"]\s*,\s*{/g;
      let scenarioMatches;
      let scenarioIndex = 1;
      while ((scenarioMatches = scenarioRegex.exec(contents)) !== null) {
        scenarioMenuItems.push({key: scenarioIndex, description: scenarioMatches[1]});
        scenarioIndex++;
      }

      let label = labelText ? labelText[1] : '';
      sandboxes.push({
        key: sandboxPath,
        searchKey: `${label}${typeName}`,
        name: typeName,
        label: label,
        scenarioMenuItems
      });
    }
  });

  content.addLine(`export function getSandboxMenuItems() {`);
  content.addLine(`return ${JSON.stringify(sandboxes)};`);
  content.addLine(`}`);

  content.addLine(`export function getSandbox(path: string) {`);
  content.addLine(`switch(path) {`);
  sandboxes.forEach(({key}) => {
    content.addLine(`case '${key}':`);
    content.addLine(`return import('${key}').then(sandbox => { return sandbox.default.serialize('${key}'); });`);
  });
  content.addLine(`}}`);

  let filePath = path.resolve(home, './sandboxes.ts');
  fs.writeFile(filePath, content.dump(), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`Created file: ${filePath}`);
  });
};
