import { readFileSync, writeFileSync } from 'fs';

export function removeDynamicImports(sandboxPath: string) {
    const data = readFileSync(sandboxPath, 'utf-8');
    const dataArray = data.split('\n');
    const getSandboxIndex = dataArray.findIndex(val => val.includes('getSandbox(path)'));
    const result = dataArray.slice(0, getSandboxIndex).join('\n');
    writeFileSync(sandboxPath, result, { encoding: 'utf-8' });
}
