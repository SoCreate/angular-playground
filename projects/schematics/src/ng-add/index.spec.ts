import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
  it('should work for a default project', async () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJson({
      root: '',
      sourceRoot: 'src',
      stylesExtension: 'css',
    }));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    verifyBasicFiles(resultTree, {
      sourceRootPath: './src',
      mainFilePath: 'src/main.playground.ts',
    });

    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('');
    expect(angularJson.projects.playground.sourceRoot).toBe('src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('tsconfig.playground.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('src/styles.css');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('src/environments/environment.prod.ts');
  });
  it('should work for a project created with `ng g app`', async () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJson({
      root: 'projects/something',
      sourceRoot: 'projects/something/src',
      stylesExtension: 'css',
    }));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    verifyBasicFiles(resultTree, {
      sourceRootPath: './projects/something/src',
      mainFilePath: 'projects/something/src/main.playground.ts',
    });

    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('projects/something');
    expect(angularJson.projects.playground.sourceRoot).toBe('projects/something/src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('projects/something/src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('projects/something/src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('projects/something/src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('projects/something/tsconfig.playground.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('projects/something/src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('projects/something/src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('projects/something/src/styles.css');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('projects/something/src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('projects/something/src/environments/environment.prod.ts');
  });
  it('should work for a project with a non-default style extension', async () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJson({
      root: '',
      sourceRoot: 'src',
      stylesExtension: 'scss',
    }));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    verifyBasicFiles(resultTree, {
      sourceRootPath: './src',
      mainFilePath: 'src/main.playground.ts',
    });

    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('');
    expect(angularJson.projects.playground.sourceRoot).toBe('src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('tsconfig.playground.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('src/styles.scss');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('src/environments/environment.prod.ts');
  });
  it('should work for a project that contains only a library', async () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJsonForLibrary(false));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    verifyBasicFiles(resultTree, {
      sourceRootPath: './projects/foo-lib/src',
      mainFilePath: 'projects/foo-lib/src/main.playground.ts',
    });

    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('projects/foo-lib');
    expect(angularJson.projects.playground.sourceRoot).toBe('projects/foo-lib/src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('projects/foo-lib/src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('projects/foo-lib/src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('projects/foo-lib/src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('projects/foo-lib/tsconfig.playground.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('projects/foo-lib/src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('projects/foo-lib/src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('projects/foo-lib/src/styles.css');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('projects/foo-lib/src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('projects/foo-lib/src/environments/environment.prod.ts');
  });
  it('should work for a project that contains a library followed by an application', async () => {
    const tree = Tree.empty();
    tree.create('angular.json', createAngularJsonForLibrary(true));
    tree.create('package.json', createPackageJson());
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const resultTree = await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    verifyBasicFiles(resultTree, {
      sourceRootPath: './projects/foo-lib-tester/src',
      mainFilePath: 'projects/foo-lib-tester/src/main.playground.ts',
    });

    const angularJson = getJsonFileAsObject(resultTree, 'angular.json');
    expect(angularJson.projects.playground.root).toBe('projects/foo-lib-tester');
    expect(angularJson.projects.playground.sourceRoot).toBe('projects/foo-lib-tester/src');
    expect(angularJson.projects.playground.architect.build.options.outputPath).toBe('dist/playground');
    expect(angularJson.projects.playground.architect.build.options.index).toBe('projects/foo-lib-tester/src/index.html');
    expect(angularJson.projects.playground.architect.build.options.main).toBe('projects/foo-lib-tester/src/main.playground.ts');
    expect(angularJson.projects.playground.architect.build.options.polyfills).toBe('projects/foo-lib-tester/src/polyfills.ts');
    expect(angularJson.projects.playground.architect.build.options.tsConfig).toBe('projects/foo-lib-tester/tsconfig.playground.json');
    expect(angularJson.projects.playground.architect.build.options.assets[0]).toBe('projects/foo-lib-tester/src/favicon.ico');
    expect(angularJson.projects.playground.architect.build.options.assets[1]).toBe('projects/foo-lib-tester/src/assets');
    expect(angularJson.projects.playground.architect.build.options.styles[0]).toBe('projects/foo-lib-tester/src/styles.scss');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].replace)
      .toBe('projects/foo-lib-tester/src/environments/environment.ts');
    expect(angularJson.projects.playground.architect.build.configurations.production.fileReplacements[0].with)
      .toBe('projects/foo-lib-tester/src/environments/environment.prod.ts');
  });
  it('should throw if there are no projects', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = Tree.empty();
    tree.create('angular.json', '{ "projects": {} }');
    const errorMessage = 'Your app must have at least 1 project to use Playground.';
    const promise = runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    await expect(promise).rejects.toThrowError(errorMessage);
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

const createAngularJsonForLibrary = (includeTestApp = false) => {
  const lib = `"foo-lib": {
    "root": "projects/foo-lib",
    "sourceRoot": "projects/foo-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "options": {}
      }
    }
  }`;
  const libTestApp = `"foo-lib-tester": {
    "root": "projects/foo-lib-tester",
    "sourceRoot": "projects/foo-lib-tester/src",
    "projectType": "application",
    "prefix": "app",
    "architect": {
      "build": {
        "options": {
          "styles": [
            "src/styles.scss"
          ]
        }
      }
    }
  }`;
  return includeTestApp
    ? `{ "projects": { ${lib}, ${libTestApp} } }`
    : `{ "projects": { ${lib} } }`;
};

const createPackageJson = () => `{
  "scripts": {},
  "dependencies": {
  },
  "devDependencies": {}
}`;

const verifyBasicFiles = (tree: UnitTestTree, options: { sourceRootPath: string, mainFilePath: string }) => {
  // package.json
  const packageJson = getJsonFileAsObject(tree, 'package.json');
  expect(packageJson.scripts.playground).toBe('angular-playground');

  // angular-playground.json
  const angularPlaygroundJson = getJsonFileAsObject(tree, 'angular-playground.json');
  expect(angularPlaygroundJson.sourceRoots).toEqual([options.sourceRootPath]);
  expect(angularPlaygroundJson.angularCli.appName).toBe('playground');

  // main.playground.ts
  const mainFile = tree.readContent(options.mainFilePath);
  expect(mainFile).toBeTruthy();
};
