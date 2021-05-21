import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { getProject, getProjectPath } from '../utils/project';
import { Schema } from './schema';
import { parseName } from '@schematics/angular/utility/parse-name';
import { getWorkspace } from "@schematics/angular/utility/workspace";

export default function sandbox(options: Schema): Rule {
  // @ts-ignore
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    if (options.path === undefined) {
      options.path = getProjectPath(workspace, options);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const targetPath = options.flat
      ? options.path
      : `${options.path}/${options.name}`;

    const prefix = getProject(workspace, {})?.prefix;
    const selector = `${prefix}-${options.name}`;

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        selector,
        ...options,
      }),
      move(targetPath),
    ]);

    return chain([
      branchAndMerge(mergeWith(templateSource)),
    ]);
  };
}
