import { Tree } from '@angular-devkit/schematics';

/**
 * Moves a dependency from 'dependencies' to 'devDependencies'
 */
export function moveDependencyFromDepsToDevDeps(
  host: Tree,
  packageName: string
): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    // create devDeps if it does not exist
    if (!json['devDependencies']) {
      json['devDependencies'] = {};
    }

    // find package in dependencies and move it to devDpendencies
    const dependencies = json['dependencies'];
    if (dependencies) {
      const version = dependencies[packageName];
      delete dependencies[packageName];
      json['dependencies'] = dependencies;
      json['devDependencies'][packageName] = version;
    }

    // replace the contents of the project's package file
    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}
