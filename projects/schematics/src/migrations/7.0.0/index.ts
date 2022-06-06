import { isJsonArray, normalize, workspaces } from '@angular-devkit/core';
import {
  apply,
  chain,
  filter,
  forEach,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { getProject, getSourceRoot } from '../../utils/project';
import { Builders } from '@schematics/angular/utility/workspace-models';
import { constructPath } from '../../utils/paths';
import { getWorkspace, updateWorkspace } from "@schematics/angular/utility/workspace";

export default function migration(options: any): Rule {
  return chain([
    configure(options),
    updateFiles(options),
  ]);
}

function updateAppInWorkspaceFile(
  options: {stylesExtension: string},
  project: workspaces.ProjectDefinition, name: string): Rule {

  return updateWorkspace((workspace) => {
    const projectRoot = normalize(project.root);
    const projectRootParts = projectRoot.split('/');
    const sourceRoot = getSourceRoot(project.sourceRoot);
    const sourceRootParts = sourceRoot.split('/');

    workspace.projects.delete(name);
    workspace.projects.add({
      name,
      root: projectRoot,
      sourceRoot,
      projectType: 'application',
      targets:
        {
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
          }
        }
    });

  });

}

function configure(options: any): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
    const project = getProject(workspace, options, 'application');

    if (!project) {
      throw new SchematicsException('Your app must have at least 1 project to use Playground.');
    }

    let stylesExtension = 'css';
    const buildTarget = project.targets.get('build');
    if (
      buildTarget
      && buildTarget.options
      && buildTarget.options.styles
      && isJsonArray(buildTarget.options.styles)
    ) {
      const mainStyle = buildTarget.options.styles
        .find((path: string | {input: string}) => typeof path === 'string'
          ? path.includes('/styles.')
          : path.input.includes('/styles.'));
      if (mainStyle) {
        // @ts-ignore
        const mainStyleString = typeof mainStyle === 'string' ? mainStyle : mainStyle.input;
        stylesExtension = mainStyleString.split('.').pop();
      }
    }

    return chain([
      updateAppInWorkspaceFile({stylesExtension}, project, 'playground'),
    ]);
  };
}

function updateFiles(options: any): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
    const project = getProject(workspace, options);
    const sourceRoot = getSourceRoot(project?.sourceRoot);
    const tsconfigJsonTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('tsconfig.playground.json')),
      template({}),
      overwriteIfExists(tree),
    ]);
    const playgroundMainTemplateSource = apply(url('./files'), [
      filter(path => path.endsWith('main.playground.ts')),
      template({}),
      move(sourceRoot),
      overwriteIfExists(tree),
    ]);
    return chain([
      mergeWith(tsconfigJsonTemplateSource),
      mergeWith(playgroundMainTemplateSource),
    ]);
  };
}

// Add to resolve issue with mergeWith not working when using MergeStrategy.Overwrite
// When not using this function I get this error:  "Error [file] already exists."
// https://github.com/angular/angular-cli/issues/11337#issuecomment-516543220
function overwriteIfExists(tree: Tree): Rule {
  return forEach(fileEntry => {
    if (tree.exists(fileEntry.path)) {
      tree.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}


