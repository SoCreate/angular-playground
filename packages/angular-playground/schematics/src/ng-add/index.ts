import { branchAndMerge, chain, mergeWith, Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { addPackageToPackageJson } from '../utils/package';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { playgroundVersion } from '../utils/libs-version';
import {
  addProjectToWorkspace,
  getWorkspace,
  WorkspaceProject,
  WorkspaceSchema
} from '@schematics/angular/utility/config';
import { addNpmScriptToPackageJson } from '../utils/npm-script';
import { getProject } from '../utils/project';

export default function add(options: any): Rule {
  return chain([
    install(),
    configure(options),
    main(),
  ])
}

export function install(): Rule {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(host, 'devDependencies', 'angular-playground', playgroundVersion);
    addNpmScriptToPackageJson(host, 'playground', 'angular-playground');
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function addAppToWorkspaceFile(options: { stylesExtension: string }, workspace: WorkspaceSchema,
                               projectRoot: string, packageName: string): Rule {

  const project: Partial<WorkspaceProject> = {
    root: `${projectRoot}`,
    sourceRoot: `${projectRoot}/src`,
    projectType: 'application',
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:browser',
        options: {
          outputPath: `${projectRoot}/dist/playground`,
          index: `${projectRoot}/src/index.html`,
          main: `${projectRoot}/src/main.playground.ts`,
          polyfills: `${projectRoot}/src/polyfills.ts`,
          tsConfig: `${projectRoot}/src/tsconfig.app.json`,
          assets: [
            `${projectRoot}/src/favicon.ico`,
            `${projectRoot}/src/asset`,
          ],
          styles: [
            `${projectRoot}/src/styles.${options.stylesExtension}`,
          ],
          scripts: []
        },
        configurations: {
          production: {
            fileReplacements: [
              {
                replace: `${projectRoot}/src/environments/environment.ts`,
                with: `${projectRoot}/src/environments/environment.prod.ts`,
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
  return (host: Tree, _context: SchematicContext) => {
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
    ])(host, _context)
  }
}

function main(): Rule {
  return branchAndMerge(mergeWith(url('./files')));
}
