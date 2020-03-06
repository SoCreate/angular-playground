import { experimental, normalize, strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { addProjectToWorkspace, getWorkspace, } from '@schematics/angular/utility/config';
import { addNpmScriptToPackageJson } from '../utils/npm-script';
import { getProject, getSourceRoot } from '../utils/project';
import { Builders, ProjectType, WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { constructPath } from '../utils/paths';

export default function add(options: any): Rule {
  return chain([
    updateNpmConfig(),
    configure(options),
    createNewFiles(options),
  ]);
}

export function updateNpmConfig(): Rule {
  return (host: Tree) => {
    addNpmScriptToPackageJson(host, 'playground', 'angular-playground');
    return host;
  };
}

function addAppToWorkspaceFile(options: { stylesExtension: string }, workspace: WorkspaceSchema,
                               project: experimental.workspace.WorkspaceProject, packageName: string): Rule {

  const projectRoot = normalize(project.root);
  const projectRootParts = projectRoot.split('/');
  const sourceRoot = getSourceRoot(project.sourceRoot);
  const sourceRootParts = sourceRoot.split('/');

  const newProject: Partial<experimental.workspace.WorkspaceProject> = {
    root: projectRoot,
    sourceRoot,
    projectType: ProjectType.Application,
    architect: {
      build: {
        builder: Builders.Browser,
        options: {
          outputPath: constructPath(['dist', 'playground']),
          index: constructPath([...sourceRootParts, 'index.html']),
          main: constructPath([...sourceRootParts, 'main.playground.ts']),
          polyfills: constructPath([...sourceRootParts, 'polyfills.ts']),
          tsConfig: constructPath([...projectRootParts, `tsconfig.playground.json`]),
          aot: false,
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
            extractLicenses: true,
            vendorChunk: false,
            buildOptimizer: true,
          },
        },
      },
      serve: {
        builder: Builders.DevServer,
        options: {
          browserTarget: 'playground:build',
          port: 4201
        },
      },
    },
  };

  return addProjectToWorkspace(workspace, packageName, newProject as WorkspaceProject);
}

function configure(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProject(host, options, 'application');

    let stylesExtension = 'css';
    if (
      project.architect
      && project.architect.build
      && project.architect.build.options
      && project.architect.build.options.styles
    ) {
      const mainStyle = project.architect.build.options.styles
        .find((path: string | { input: string }) => typeof path === 'string'
          ? path.includes('/styles.')
          : path.input.includes('/styles.'));
      if (mainStyle) {
        const mainStyleString = typeof mainStyle === 'string' ? mainStyle : mainStyle.input;
        stylesExtension = mainStyleString.split('.').pop();
      }
    }

    return chain([
      addAppToWorkspaceFile({stylesExtension}, workspace, project, 'playground'),
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
        sourceRoots: [sourceRoot],
      }),
    ]);
    const tsconfigJsonTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('tsconfig.playground.json')),
      template({}),
    ]);
    const playgroundMainTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('main.playground.ts')),
      template({}),
      move(sourceRoot),
    ]);
    return chain([
      branchAndMerge(mergeWith(angularPlaygroundJsonTemplateSource)),
      branchAndMerge(mergeWith(tsconfigJsonTemplateSource)),
      branchAndMerge(mergeWith(playgroundMainTemplateSource)),
    ])(host, context);
  };
}
