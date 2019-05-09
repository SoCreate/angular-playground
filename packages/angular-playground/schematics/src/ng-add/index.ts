import { normalize, strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain, filter,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  addProjectToWorkspace,
  getWorkspace,
  WorkspaceProject,
  WorkspaceSchema,
} from '@schematics/angular/utility/config';
import { addNpmScriptToPackageJson } from '../utils/npm-script';
import { moveDependencyFromDepsToDevDeps } from '../utils/package';
import { getProject, getSourceRoot } from '../utils/project';

export default function add(options: any): Rule {
  return chain([
    updateNpmConfig(),
    configure(options),
    createNewFiles(options),
  ]);
}

export function updateNpmConfig(): Rule {
  return (host: Tree) => {
    moveDependencyFromDepsToDevDeps(host, 'angular-playground');
    addNpmScriptToPackageJson(host, 'playground', 'angular-playground');
    return host;
  };
}

function addAppToWorkspaceFile(options: { stylesExtension: string }, workspace: WorkspaceSchema,
                               project: WorkspaceProject, packageName: string): Rule {

  const projectRoot = normalize(project.root);
  const sourceRoot = getSourceRoot(project.sourceRoot);
  const sourceRootParts = sourceRoot.split('/');
  const tsConfigPath = projectRoot === '' ? 'src' : projectRoot;
  const tsConfigPathParts = tsConfigPath.split('/');

  const newProject: Partial<WorkspaceProject> = {
    root: projectRoot,
    sourceRoot,
    projectType: 'application',
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: constructPath(['dist', 'playground']),
          index: constructPath([...sourceRootParts, 'index.html']),
          main: constructPath([...sourceRootParts, 'main.playground.ts']),
          polyfills: constructPath([...sourceRootParts, 'polyfills.ts']),
          tsConfig: constructPath([...tsConfigPathParts, 'tsconfig.app.json']),
          assets: [
            constructPath([...sourceRootParts, 'favicon.ico']),
            constructPath([...sourceRootParts, 'assets']),
          ],
          styles: [
            constructPath([...sourceRootParts, `styles.${options.stylesExtension}`]),
          ],
          scripts: [],
        },
        configurations: {
          production: {
            fileReplacements: [
              {
                replace: constructPath([...sourceRootParts, 'environments', 'environment.ts']),
                with: constructPath([...sourceRootParts, 'environments', 'environment.prod.ts']),
              },
            ],
            optimization: true,
            outputHashing: 'all',
            sourceMap: false,
            extractCss: true,
            namedChunks: false,
            aot: false,
            extractLicenses: true,
            vendorChunk: false,
            buildOptimizer: false,
          },
        },
      },
      serve: {
        builder: '@angular-devkit/build-angular:dev-server',
        options: {
          browserTarget: 'playground:build',
          port: 4201,
        },
      },
    },
  };

  return addProjectToWorkspace(workspace, packageName, newProject as WorkspaceProject);
}

function configure(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProject(host, options);

    let stylesExtension = 'css';
    if (project.architect) {
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
      addAppToWorkspaceFile({ stylesExtension }, workspace, project, 'playground'),
    ])(host, context);
  };
}

function createNewFiles(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const project = getProject(host, options);

    const sourceRoot = getSourceRoot(project.sourceRoot);
    const angularPlaygroundJsonTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('angular-playground.json')),
      template({
        ...strings,
        sourceRoot,
      }),
    ]);
    const playgroundMainTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('main.playground.ts')),
      template({}),
      move(sourceRoot),
    ]);
    return chain([
      branchAndMerge(mergeWith(angularPlaygroundJsonTemplateSource)),
      branchAndMerge(mergeWith(playgroundMainTemplateSource)),
    ])(host, context);
  };
}

const constructPath = (parts: string[], isAbsolute = false) => {
  const filteredParts = parts.filter(part => !!part);
  return `${isAbsolute ? '/' : ''}${filteredParts.join('/')}`;
};
