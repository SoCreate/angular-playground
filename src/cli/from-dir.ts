import * as fs from 'fs';
import * as path from 'path';

export const fromDir = (startPath, filter, callback) => {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }
    let files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); //recurse
        }
        else if (filter.test(filename)) callback(filename);
    }
};
