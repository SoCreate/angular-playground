import * as fs from 'fs';
import * as path from 'path';

export const fromDir = (startPath, filter, callback) => {
    if (!fs.existsSync(startPath)) {
        throw new Error(`No Directory Found: ${startPath}`);
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback);
        } else if (filter.test(filename)) {
            callback(filename);
        }
    }
};
