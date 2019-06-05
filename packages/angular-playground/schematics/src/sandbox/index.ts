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

export default function sandbox(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (options.path === undefined) {
      options.path = getProjectPath(host, options);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const targetPath = options.flat
      ? options.path
      : `${options.path}/${options.name}`;

    const prefix = getProject(host, {}).prefix;
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
    ])(host, context);
  };
}
