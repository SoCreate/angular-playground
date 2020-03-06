import { Tree } from '@angular-devkit/schematics';

/**
 * Adds a script to the package.json
 */
export function addNpmScriptToPackageJson(
  host: Tree,
  name: string,
  command: string,
): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json.scripts) {
      json.scripts = {};
    }

    if (!json.scripts[name]) {
      json.scripts[name] = command;
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}
