import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
  it('should work for a default project', () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJson({
      root: '',
      sourceRoot: 'src',
      stylesExtension: 'css',
    }));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = runner.runSchematic('ng-add', {}, tree);

    // package.json
    const packageJson = getJsonFileAsObject(resultTree, 'package.json');
    expect(packageJson.scripts['playground']).toBe('angular-playground');
    expect(packageJson.dependencies['angular-playground']).toBeUndefined();
    expect(packageJson.devDependencies['angular-playground']).toBe('1.2.3');

    // angular.json
    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('');
    expect(angularJson.projects.playground.sourceRoot).toBe('src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('tsconfig.app.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('src/styles.css');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('src/environments/environment.prod.ts');

    // angular-playground.json
    const angularPlaygroundJson = getJsonFileAsObject(resultTree, 'angular-playground.json');
    expect(angularPlaygroundJson.sourceRoots).toEqual(['./src']);
    expect(angularPlaygroundJson.angularCli.appName).toBe('playground');

    // main.playground.ts
    const mainFile = resultTree.readContent('src/main.playground.ts');
    expect(mainFile).toBeTruthy();
  });
  it('should work for a project created with `ng g app`', () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJson({
      root: 'projects/something',
      sourceRoot: 'projects/something/src',
      stylesExtension: 'css',
    }));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = runner.runSchematic('ng-add', {}, tree);

    // package.json
    const packageJson = getJsonFileAsObject(resultTree, 'package.json');
    expect(packageJson.scripts['playground']).toBe('angular-playground');
    expect(packageJson.dependencies['angular-playground']).toBeUndefined();
    expect(packageJson.devDependencies['angular-playground']).toBe('1.2.3');

    // angular.json
    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('projects/something');
    expect(angularJson.projects.playground.sourceRoot).toBe('projects/something/src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('projects/something/src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('projects/something/src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('projects/something/src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('projects/something/tsconfig.app.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('projects/something/src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('projects/something/src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('projects/something/src/styles.css');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('projects/something/src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('projects/something/src/environments/environment.prod.ts');

    // angular-playground.json
    const angularPlaygroundJson = getJsonFileAsObject(resultTree, 'angular-playground.json');
    expect(angularPlaygroundJson.sourceRoots).toEqual(['./projects/something/src']);
    expect(angularPlaygroundJson.angularCli.appName).toBe('playground');

    // main.playground.ts
    expect(resultTree.files).toContain('/projects/something/src/main.playground.ts');
  });
  it('should work for a project with a non-default style extension', () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJson({
      root: '',
      sourceRoot: 'src',
      stylesExtension: 'scss',
    }));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = runner.runSchematic('ng-add', {}, tree);

    // package.json
    const packageJson = getJsonFileAsObject(resultTree, 'package.json');
    expect(packageJson.scripts['playground']).toBe('angular-playground');
    expect(packageJson.dependencies['angular-playground']).toBeUndefined();
    expect(packageJson.devDependencies['angular-playground']).toBe('1.2.3');

    // angular.json
    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('');
    expect(angularJson.projects.playground.sourceRoot).toBe('src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('tsconfig.app.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('src/styles.scss');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('src/environments/environment.prod.ts');

    // angular-playground.json
    const angularPlaygroundJson = getJsonFileAsObject(resultTree, 'angular-playground.json');
    expect(angularPlaygroundJson.sourceRoots).toEqual(['./src']);
    expect(angularPlaygroundJson.angularCli.appName).toBe('playground');

    // main.playground.ts
    const mainFile = resultTree.readContent('src/main.playground.ts');
    expect(mainFile).toBeTruthy();
  });
  it('should throw if there are no projects', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = Tree.empty();
    tree.create('angular.json', `{
      "projects": {}
    }`);
    expect(() => runner.runSchematic('ng-add', {}, tree))
      .toThrow('Your app must have at least 1 project to use Playground.');
  });
});

const getJsonFileAsObject = (tree: UnitTestTree, filepath: string) => JSON.parse(tree.readContent(filepath));

const createAngularJson = (config: { root: string, sourceRoot: string, stylesExtension: string }) => `{
  "projects": {
    "foo": {
      "root": "${config.root}",
      "sourceRoot": "${config.sourceRoot}",
      "projectType": "application",
      "prefix": "app",
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.${config.stylesExtension}"
            ]
          }
        }
      }
    }
  }
}`;

const createPackageJson = () => `{
  "scripts": {},
  "dependencies": {
    "angular-playground": "1.2.3"
  },
  "devDependencies": {}
}`;
