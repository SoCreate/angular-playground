import { resolve as resolvePath } from 'path';
import watch from 'node-watch';

export function startWatch(sourceRoots: string[], cb: Function) {
    const filter = (fn: Function) => {
        return (evt: string, filename: string) => {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };

    sourceRoots.forEach(sourceRoot =>
        watch(resolvePath(sourceRoot), { recursive: true }, filter(cb)));
}
