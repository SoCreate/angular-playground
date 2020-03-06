import { experimental, normalize } from '@angular-devkit/core';
import {
  apply,
  chain,
  filter,
  forEach,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { getProject, getSourceRoot } from '../../utils/project';
import { Builders, ProjectType, WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/config';
import { constructPath } from '../../utils/paths';

export default function migration(options: any): Rule {
  return chain([
    configure(options),
    updateFiles(options),
  ]);
}

function updateAppInWorkspaceFile(
  options: { stylesExtension: string },
  workspace: WorkspaceSchema,
  project: experimental.workspace.WorkspaceProject, packageName: string): Rule {

  const projectRoot = normalize(project.root);
  const projectRootParts = projectRoot.split('/');
  const sourceRoot = getSourceRoot(project.sourceRoot);
  const sourceRootParts = sourceRoot.split('/');

  const playgroundProject: Partial<experimental.workspace.WorkspaceProject> = {
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

  workspace.projects[packageName] = playgroundProject as WorkspaceProject;
  return updateWorkspace(workspace);
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
      updateAppInWorkspaceFile({stylesExtension}, workspace, project, 'playground'),
    ])(host, context);
  };
}

function updateFiles(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const project = getProject(host, options);
    const sourceRoot = getSourceRoot(project.sourceRoot);
    const tsconfigJsonTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('tsconfig.playground.json')),
      template({}),
      overwriteIfExists(host),
    ]);
    const playgroundMainTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('main.playground.ts')),
      template({}),
      move(sourceRoot),
      overwriteIfExists(host),
    ]);
    return chain([
      mergeWith(tsconfigJsonTemplateSource),
      mergeWith(playgroundMainTemplateSource),
    ])(host, context);
  };
}

// Add to resolve issue with mergeWith not working when using MergeStrategy.Overwrite
// When not using this function I get this error:  "Error [file] already exists."
// https://github.com/angular/angular-cli/issues/11337#issuecomment-516543220
function overwriteIfExists(host: Tree): Rule {
  return forEach(fileEntry => {
    if (host.exists(fileEntry.path)) {
      host.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}


