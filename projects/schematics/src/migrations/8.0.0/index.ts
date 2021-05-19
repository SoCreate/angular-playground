import { isJsonArray, normalize, workspaces } from '@angular-devkit/core';
import { chain, Rule, SchematicsException, Tree, } from '@angular-devkit/schematics';
import { getProject, getSourceRoot } from '../../utils/project';
import { Builders, ProjectType } from '@schematics/angular/utility/workspace-models';
import { constructPath } from '../../utils/paths';
import { getWorkspace, updateWorkspace } from "@schematics/angular/utility/workspace";
import { TargetDefinitionCollection } from "@angular-devkit/core/src/workspace";

export default function migration(options: any): Rule {
  return chain([
    configure(options)
  ]);
}

function updateAppInWorkspaceFile(
  options: { stylesExtension: string },
  workspace: workspaces.WorkspaceDefinition,
  project: workspaces.ProjectDefinition, name: string): Rule {

  const projectRoot = normalize(project.root);
  const projectRootParts = projectRoot.split('/');
  const sourceRoot = getSourceRoot(project.sourceRoot);
  const sourceRootParts = sourceRoot.split('/');

  workspace.projects.set(name, {
    root: projectRoot,
    sourceRoot,
    extensions: { projectType: ProjectType.Application },
    targets: new TargetDefinitionCollection({
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
            buildOptimizer: false,
            extractLicenses: false,
            outputHashing: 'all'
          },
          development: {
            buildOptimizer: false,
            optimization: false,
            vendorChunk: true,
            extractLicenses: false,
            sourceMap: true,
            namedChunks: true
          }
        },
        defaultConfiguration: 'development'
      },
      serve: {
        builder: Builders.DevServer,
        options: {
          browserTarget: 'playground:build',
          port: 4201
        },
      }
    })
  });

  return updateWorkspace(workspace);
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
        .find((path: string | { input: string }) => typeof path === 'string'
          ? path.includes('/styles.')
          : path.input.includes('/styles.'));
      if (mainStyle) {
        // @ts-ignore
        const mainStyleString = typeof mainStyle === 'string' ? mainStyle : mainStyle.input;
        stylesExtension = mainStyleString.split('.').pop();
      }
    }

    return chain([
      updateAppInWorkspaceFile({stylesExtension}, workspace, project, 'playground'),
    ]);
  };
}
