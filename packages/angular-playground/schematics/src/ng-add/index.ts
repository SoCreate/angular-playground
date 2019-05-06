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
                               project: WorkspaceProject | undefined, projectRoot: string, packageName: string): Rule {

  const sourceRoot = project && typeof project.sourceRoot === 'string'
    ? project.sourceRoot
    : 'src';

  const normalizedProjectRoot = normalize(projectRoot === '' ? '' : `${projectRoot}/`)
  const newProject: Partial<WorkspaceProject> = {
    root: `${projectRoot}`,
    sourceRoot: `${normalizedProjectRoot}${sourceRoot}`,
    projectType: 'application',
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: `${normalizedProjectRoot}dist/playground`,
          index: `${normalizedProjectRoot}${sourceRoot}/index.html`,
          main: `${normalizedProjectRoot}${sourceRoot}/main.playground.ts`,
          polyfills: `${normalizedProjectRoot}${sourceRoot}/polyfills.ts`,
          tsConfig: `${normalizedProjectRoot}${sourceRoot}/tsconfig.app.json`,
          assets: [
            `${normalizedProjectRoot}${sourceRoot}/favicon.ico`,
            `${normalizedProjectRoot}${sourceRoot}/assets`,
          ],
          styles: [
            `${normalizedProjectRoot}${sourceRoot}/styles.${options.stylesExtension}`,
          ],
          scripts: []
        },
        configurations: {
          production: {
            fileReplacements: [
              {
                replace: `${normalizedProjectRoot}${sourceRoot}/environments/environment.ts`,
                with: `${normalizedProjectRoot}${sourceRoot}/environments/environment.prod.ts`,
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

  return addProjectToWorkspace(workspace, packageName, newProject as WorkspaceProject);
}

function configure(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProject(host, options);

    let stylesExtension = 'css';
    if (project && project.architect) {
      const mainStyle = project.architect.build.options.styles.find((path: string | { input: string }) => {
        return typeof path === 'string'
          ? path.includes('/styles.')
          : path.input.includes('/styles.');
      });
      if (mainStyle) {
        const mainStyleString = typeof mainStyle === 'string' ? mainStyle : mainStyle.input;
        stylesExtension = mainStyleString.split('.').pop();
      }
    }

    return chain([
      addAppToWorkspaceFile({ stylesExtension }, workspace, project, '', 'playground'),
    ])(host, context)
  }
}

function main(): Rule {
  return branchAndMerge(mergeWith(url('./files')));
}
