import { resolve as resolvePath } from 'path';
import watch = require('node-watch');

export function startWatch(sourceRoots: string[], cb: Function) {
    const filter = (fn: Function) => {
        return (evt: string, filename: string) => {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };

    const sourceRootPaths = sourceRoots.map(sourceRoot => resolvePath(sourceRoot));
    watch(sourceRootPaths, { recursive: true }, filter(cb));
}
