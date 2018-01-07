import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { exit } from 'process';
import { existsSync } from 'fs';

export interface Config {
    sourceRoot: string;
    angularAppName: string;
}

export function applyConfigurationFile(program: any): Config {
    const playgroundConfig = loadConfig(program.config);
    // TODO: Missing value error reporting
    return {
        sourceRoot: playgroundConfig.sourceRoot || program.src,
        angularAppName: playgroundConfig.angularCli.appName || program.ngCliApp
    };
}

function loadConfig(path: string) {
    const configPath = resolvePath(path);
    if (!existsSync(configPath)) {
        throw new Error(chalk.red(`Failed to load config file ${configPath}`));
    }

    return require(configPath.replace(/.json$/, ''));
}

