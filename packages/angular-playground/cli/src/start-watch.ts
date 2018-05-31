import { resolve as resolvePath } from 'path';
import watch = require('node-watch');

export function startWatch(sourceRoot: string, cb: Function) {
    const filter = (fn: Function) => {
        return (evt: string, filename: string) => {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };

    watch([resolvePath(sourceRoot)], { recursive: true }, filter(cb));
}
