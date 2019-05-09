import { Tree } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('sandbox', () => {
  it('should work when flat is true', () => {
    const tree = Tree.empty();
    const prefix = 'app';
    tree.create('angular.json', createAngularJson({
      root: 'projects/foo',
      sourceRoot: 'projects/foo/src',
      prefix,
    }));
    tree.create('src/app/feature1/feature1.component.ts', createTestComponent({
      prefix,
      name: 'Feature1',
    }));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const generateSandboxOptions = {
      path: 'projects/foo/src/app/feature1',
      name: 'feature1',
      flat: true,
    };
    const resultTree = runner.runSchematic('sandbox', generateSandboxOptions, tree);

    const newSandbox = resultTree
      .readContent('projects/foo/src/app/feature1/feature1.component.sandbox.ts');
    expect(newSandbox).toMatch(/import { Feature1Component } from '\.\/feature1.component';/);
    expect(newSandbox).toMatch(/export default sandboxOf\(Feature1Component\)/);
    expect(newSandbox).toMatch(/template: `<app-feature1><\/app-feature1>`/);
  });
  it('should work when flat is false', () => {
    const tree = Tree.empty();
    const prefix = 'app';
    tree.create('angular.json', createAngularJson({
      root: '',
      sourceRoot: 'src',
      prefix,
    }));
    tree.create('src/app/feature1/sub-feature1/sub-feature1.component.ts', createTestComponent({
      prefix,
      name: 'SubFeature1',
    }));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const generateSandboxOptions = {
      path: 'src/app/feature1/sub-feature1',
      name: 'sub-feature1',
      flat: false,
    };
    const resultTree = runner.runSchematic('sandbox', generateSandboxOptions, tree);

    const newSandbox = resultTree
      .readContent('src/app/feature1/sub-feature1/sub-feature1/sub-feature1.component.sandbox.ts');
    expect(newSandbox).toMatch(/import { SubFeature1Component } from '\.\.\/sub-feature1.component';/);
    expect(newSandbox).toMatch(/export default sandboxOf\(SubFeature1Component\)/);
    expect(newSandbox).toMatch(/template: `<app-sub-feature1><\/app-sub-feature1>`/);
  });
  it('should work for any prefix', () => {
    const tree = Tree.empty();
    const prefix = 'fizzbuzz';
    tree.create('angular.json', createAngularJson({
      root: '',
      sourceRoot: 'src',
      prefix,
    }));
    tree.create('src/app/feature1/feature1.component.ts', createTestComponent({
      prefix,
      name: 'Feature1',
    }));
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const generateSandboxOptions = {
      path: 'src/app/feature1',
      name: 'feature1',
      flat: true,
    };
    const resultTree = runner.runSchematic('sandbox', generateSandboxOptions, tree);

    const newSandbox = resultTree
      .readContent('src/app/feature1/feature1.component.sandbox.ts');
    expect(newSandbox).toMatch(/template: `<fizzbuzz-feature1><\/fizzbuzz-feature1>`/);
  });
});

const createAngularJson = (config: { root: string, sourceRoot: string, prefix: string }) => `{
  "projects": {
    "foo": {
      "root": "${config.root}",
      "sourceRoot": "${config.sourceRoot}",
      "projectType": "application",
      "prefix": "${config.prefix}"
    }
  }
}`;

const createTestComponent = (config: { prefix: string, name: string }) => `
import { Component } from '@angular/core';

@Component({
  selector: '${config.prefix}-${strings.dasherize(config.name)}',
  templateUrl: './${strings.dasherize(config.name)}.component.html',
  styleUrls: ['./${strings.dasherize(config.name)}.component.css']
})
export class ${config.name}Component {}
`;
