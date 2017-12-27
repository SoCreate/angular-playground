import { fromDir } from './from-dir';
import { StringBuilder } from './string-builder';
import * as fs from 'fs';
import * as path from 'path';

interface SandboxFileInformation {
    key: string;
    searchKey: string;
    name: string;
    label: string;
    scenarioMenuItems: {
        key: string;
        description: string;
    }[];
}

export async function build(rootPath): Promise<any> {
    let home = path.resolve(rootPath);

    const sandboxes = getSandboxFileInformation(home);
    const filePath = path.resolve(home, './sandboxes.ts');
    const fileContent = buildSandboxFileContents(sandboxes);

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileContent, function (err) {
            if (err) {
                reject(err);
            } else {
                console.log(`Created file: ${filePath}`);
                resolve(filePath);
            }
        });
    });
}

export function getSandboxFileInformation(home: string): SandboxFileInformation[] {
    const sandboxes = [];

    fromDir(home, /\.sandbox.ts$/, (filename) => {
        let sandboxPath = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
        const contents = fs.readFileSync(filename, 'utf8');

        const matchSandboxOf = /\s?sandboxOf\s*\(\s*([^)]+?)\s*\)/g.exec(contents);
        if (matchSandboxOf) {
            const typeName = matchSandboxOf[1].split(',')[0].trim();
            const labelText = /label\s*:\s*['"](.+)['"]/g.exec(matchSandboxOf[0]);

            let scenarioMenuItems = [];
            const scenarioRegex = /\.add\s*\(['"](.+)['"]\s*,\s*{/g;
            let scenarioMatches;
            let scenarioIndex = 1;
            while ((scenarioMatches = scenarioRegex.exec(contents)) !== null) {
                scenarioMenuItems.push({ key: scenarioIndex, description: scenarioMatches[1] });
                scenarioIndex++;
            }

            let label = labelText ? labelText[1] : '';
            sandboxes.push({
                key: sandboxPath,
                searchKey: `${typeName}${label}`,
                name: typeName,
                label: label,
                scenarioMenuItems
            });
        }
    });

    return sandboxes;
}

export function buildSandboxFileContents(sandboxes: SandboxFileInformation[]): string {
    const content = new StringBuilder();
    content.addLine(`export function getSandboxMenuItems() {`);
    content.addLine(`return ${JSON.stringify(sandboxes)};`);
    content.addLine(`}`);

    content.addLine(`export function getSandbox(path: string) {`);
    content.addLine(`switch(path) {`);

    sandboxes.forEach(({ key }) => {
        content.addLine(`case '${key}':`);
        content.addLine(`return import('${key}').then(sandbox => { return sandbox.default.serialize('${key}'); });`);
    });

    content.addLine(`}}`);
    return content.dump();
}
