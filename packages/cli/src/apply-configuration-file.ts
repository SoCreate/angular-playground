import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { exit } from 'process';

export function applyConfigurationFile(program: any) {
    const playgroundConfig = loadConfig(program.config);
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
