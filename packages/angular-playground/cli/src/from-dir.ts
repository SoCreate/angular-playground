import { existsSync, readdirSync, lstatSync } from 'fs';
import { join as joinPath } from 'path';

export function fromDir (startPath: string, filter: RegExp, callback: Function) {
  if (!existsSync(startPath)) {
      throw new Error(`No Directory Found: ${startPath}`);
  }

  const files = readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
      const filename = joinPath(startPath, files[i]);
      const stat = lstatSync(filename);

      if (stat.isDirectory()) {
          fromDir(filename, filter, callback);
      } else if (filter.test(filename)) {
          callback(filename);
      }
  }
}
