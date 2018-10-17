import { normalize } from '@angular-devkit/core';
import { branchAndMerge, chain, mergeWith, Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import {
  addProjectToWorkspace,
  getWorkspace,
  WorkspaceProject,
  WorkspaceSchema
} from '@schematics/angular/utility/config';
import { addNpmScriptToPackageJson } from '../utils/npm-script';
import { moveDependencyFromDepsToDevDeps } from '../utils/package';
import { getProject } from '../utils/project';

export default function add(options: any): Rule {
  return chain([
    install(),
    configure(options),
    main(),
  ])
}

export function install(): Rule {
  return (host: Tree) => {
    moveDependencyFromDepsToDevDeps(host, 'angular-playground');
    addNpmScriptToPackageJson(host, 'playground', 'angular-playground');
    return host;
  };
}

function addAppToWorkspaceFile(options: { stylesExtension: string }, workspace: WorkspaceSchema,
                               projectRoot: string, packageName: string): Rule {

  const normalizedProjectRoot = normalize(projectRoot === '' ? '' : `${projectRoot}/`)
  const project: Partial<WorkspaceProject> = {
    root: `${projectRoot}`,
    sourceRoot: `${normalizedProjectRoot}src`,
    projectType: 'application',
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: `${normalizedProjectRoot}dist/playground`,
          index: `${normalizedProjectRoot}src/index.html`,
          main: `${normalizedProjectRoot}src/main.playground.ts`,
          polyfills: `${normalizedProjectRoot}src/polyfills.ts`,
          tsConfig: `${normalizedProjectRoot}src/tsconfig.app.json`,
          assets: [
            `${normalizedProjectRoot}src/favicon.ico`,
            `${normalizedProjectRoot}src/assets`,
          ],
          styles: [
            `${normalizedProjectRoot}src/styles.${options.stylesExtension}`,
          ],
          scripts: []
        },
        configurations: {
          production: {
            fileReplacements: [
              {
                replace: `${normalizedProjectRoot}src/environments/environment.ts`,
                with: `${normalizedProjectRoot}src/environments/environment.prod.ts`,
              }
            ],
            optimization: true,
            outputHashing: 'all',
            sourceMap: false,
            extractCss: true,
            namedChunks: false,
            aot: false,
            extractLicenses: true,
            vendorChunk: false,
            buildOptimizer: false
          }
        }
      },
      serve: {
        builder: '@angular-devkit/build-angular:dev-server',
        options: {
          browserTarget: 'playground:build',
          port: 4201
        }
      }
    }
  };

  return addProjectToWorkspace(workspace, packageName, project as WorkspaceProject);
}

function configure(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProject(host, options);

    let stylesExtension = 'css';
    if (project.architect) {
      const mainStyle = project.architect.build.options.styles.find((path: string) => path.includes('/styles.'));
      if (mainStyle) {
        stylesExtension = mainStyle.split('.').pop();
      }
    }

    return chain([
      addAppToWorkspaceFile({ stylesExtension }, workspace, '', 'playground'),
    ])(host, context)
  }
}

function main(): Rule {
  return branchAndMerge(mergeWith(url('./files')));
}
