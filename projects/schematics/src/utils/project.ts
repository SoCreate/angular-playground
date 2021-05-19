import { normalize, workspaces } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';

export function getProjectPath(
  workspace: workspaces.WorkspaceDefinition,
  options: { project?: string | undefined; path?: string | undefined },
) {
  const project = getProject(workspace, options);

  if (project?.root.substr(-1) === '/') {
    project.root = project.root.substr(0, project.root.length - 1);
  }

  if (options.path === undefined) {
    const projectDirName = project?.extensions.projectType === 'application'
      ? 'app'
      : 'lib';

    const sourceRoot = getSourceRoot(project?.sourceRoot);
    return `${project?.root ? `/${project.root}` : ''}/${sourceRoot}/${projectDirName}`;
  }

  return options.path;
}

export function getProject(
  workspace: workspaces.WorkspaceDefinition,
  options: { project?: string | undefined; path?: string | undefined },
  typeFilter: 'application' | 'library' | null = null,
): workspaces.ProjectDefinition | undefined {

  if (!options.project) {
    // can have no projects if created with `ng new <name> --createApplication=false`
    if (workspace.projects.size === 0) {
      throw new SchematicsException('Your app must have at least 1 project to use Playground.');
    }
    // if type filter is not set, use first project
    let firstFilteredProject = workspace.projects.keys().next().value;
    if (typeFilter) {
      // apply filter
      workspace.projects.forEach((project, key) => {
        if (project.extensions.projectType === typeFilter) {
          firstFilteredProject = key;
          return;
        }
      });
    }
    options.project = firstFilteredProject;
  }

  return workspace.projects.get(options.project || '');
}

export const getSourceRoot = (sourceRoot: string | undefined) =>
  sourceRoot === undefined ? 'src' : normalize(sourceRoot);
