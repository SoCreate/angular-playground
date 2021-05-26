import { existsSync, readdirSync, lstatSync } from 'fs';
import { join as joinPath } from 'path';

export function fromDirMultiple(startPaths: string[], filter: RegExp, excludeDirectoryFilter: RegExp | null, callback: Function) {
    for (const path of startPaths) {
        fromDir(path, path, filter, excludeDirectoryFilter, callback);
    }
}

/**
 * Recursively apply callback to files in a directory (and sub-directories) that match the
 * provided regular expression
 */
function fromDir(rootPath: string, startPath: string, filter: RegExp, excludeDirectoryFilter: RegExp | null, callback: Function) {
    if (!existsSync(startPath)) {
        throw new Error(`No Directory Found: ${startPath}`);
    }

    const files = readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = joinPath(startPath, files[i]);
        const stat = lstatSync(filename);

        if (stat.isDirectory()) {
            if (excludeDirectoryFilter) {
                if (!excludeDirectoryFilter.test(filename)) {
                    fromDir(rootPath, filename, filter, excludeDirectoryFilter, callback);
                }
            } else {
                fromDir(rootPath, filename, filter, excludeDirectoryFilter, callback);
            }
        } else if (filter.test(filename)) {
            callback(filename, rootPath);
        }
    }
}
