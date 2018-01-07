import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { exit } from 'process';

export interface Config {
    sourceRoot: string;
    angularAppName: string;
}

const CONFIG_GROUPS = [ 'angularCli' ];

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
    try {
        return require(configPath.replace(/.json$/, ''));
    } catch (e) {
        console.log(chalk.red(`Failed to load config file ${configPath}`));
        exit(1);
    }
}

