import chalk from 'chalk';
import { writeFile, readFileSync, existsSync, unlinkSync } from 'fs';
import { join as joinPath, resolve as resolvePath } from 'path';
import { fromDir } from '../lib/from-dir';
import { StringBuilder } from '../lib/string-builder';

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

export function buildSandboxes(srcPath: string, noChunk: boolean): Promise<string> {
    const chunkMode = noChunk ? 'eager' : 'lazy';
    const home = resolvePath(srcPath);
    const sandboxes = findSandboxes(home);
    const filePath = resolvePath(__dirname, '../../build/src/shared/sandboxes.js');
    const fileContent = buildSandboxFileContents(sandboxes, home, chunkMode);

    // TODO: Remove next release post 3.1.0
    deleteDeprecatedSandboxFileIfNecessary(home);

    return new Promise((resolve, reject) => {
        writeFile(filePath, fileContent, err => {
            if (err) {
                console.log(chalk.red('Unable to write sandboxes.\n'));
                throw new Error(err.message);
            }
            console.log(chalk.bgBlue('Successfully read sandboxes.'));
            resolve(filePath);
        });
    });
}

function findSandboxes(home: string): SandboxFileInformation[] {
    const sandboxes = [];

    fromDir(home, /\.sandbox.ts$/, (filename) => {
        let sandboxPath = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
        const contents = readFileSync(filename, 'utf8');

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

function buildSandboxFileContents(sandboxes: SandboxFileInformation[], home: string, chunkMode: string): string {
    const content = new StringBuilder();
    content.addLine(`function getSandboxMenuItems() {`);
    content.addLine(`return ${JSON.stringify(sandboxes)};`);
    content.addLine(`}`);

    content.addLine(`function getSandbox(path) {`);
    content.addLine(`switch(path) {`);

    sandboxes.forEach(({ key }, i) => {
        let fullPath = joinPath(home, key);
        // Normalize slash syntax for Windows/Unix filepaths
        fullPath = slash(fullPath);
        content.addLine(`case '${key}':`);
        content.addLine(`  return import( /* webpackMode: "${chunkMode}" */ '${fullPath}').then(_ => _.default.serialize('${key}'));`);
    });
    content.addLine(`}`);
    content.addLine(`}`);
    content.addLine('export { getSandbox, getSandboxMenuItems };');

    return content.dump();
}

// TODO: Remove
// Provided for minor release post sandboxes.ts resolution changes
function deleteDeprecatedSandboxFileIfNecessary(home: string) {
    const sandboxesFile = resolvePath(home, './sandboxes.ts');
    if (existsSync(sandboxesFile)) {
        unlinkSync(sandboxesFile);
    }
}

// Turns windows URL string ('c:\\etc\\') into URL node expects ('c:/etc/')
// https://github.com/sindresorhus/slash
function slash(input: string) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(input);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(input);

    if (isExtendedLengthPath || hasNonAscii) {
        return input;
    }

    return input.replace(/\\/g, '/');
}
