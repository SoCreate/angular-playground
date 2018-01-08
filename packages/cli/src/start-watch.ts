import { resolve as resolvePath } from 'path';
import * as watch from 'node-watch';

export function startWatch(sourceRoot: string, cb: Function) {
    const filter = (fn: Function) => {
        return (filename: string) => {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };

    watch([resolvePath(sourceRoot)], filter(cb));
}
