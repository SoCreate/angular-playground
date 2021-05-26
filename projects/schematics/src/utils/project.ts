import { normalize, workspaces } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';
import { ProjectDefinitionCollection } from "@angular-devkit/core/src/workspace/definitions";

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
    let firstFilteredProjectName = getFirstProjectName(workspace.projects);
    if (typeFilter) {
      // apply filter
      for (const [projectName, project] of workspace.projects.entries()) {
        if (project.extensions.projectType === typeFilter) {
          firstFilteredProjectName = projectName;
          break;
        }
      }
    }
    options.project = firstFilteredProjectName;
  }
  return workspace.projects.get(options.project || '');
}

export const getSourceRoot = (sourceRoot: string | undefined) =>
  sourceRoot === undefined ? 'src' : normalize(sourceRoot);

const getFirstProjectName = (projects: ProjectDefinitionCollection): string | undefined => {
  let firstProject: string | undefined = undefined;
  for (const projectName of projects.keys()) {
    firstProject = projectName;
    break;
  }
  return firstProject;
};
