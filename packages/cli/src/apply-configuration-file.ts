import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { exit } from 'process';
import { existsSync } from 'fs';

export interface Config {
    sourceRoot: string;
    angularAppName: string;
    noChunk: boolean;
    noWatch: boolean;
    noServe: boolean;
    checkErrors: boolean;
    randomScenario: boolean;
    timeout: number;
    reportType: string;
    reportPath: string;
    angularCliPath: string;
    angularCliPort: number;
    angularCliEnv: string | undefined;
    angularCliAdditionalArgs: string[];
}

export function applyConfigurationFile(program: any): Config {
    const playgroundConfig = loadConfig(program.config);
    // TODO: Missing value error reporting
    return {
        sourceRoot: playgroundConfig.sourceRoot || program.src,
        angularAppName: playgroundConfig.angularCli.appName || program.ngCliApp,
        noChunk: playgroundConfig.noChunk || program.noChunk,
        noWatch: playgroundConfig.noWatch || program.noWatch,
        noServe: playgroundConfig.noServe || program.noServe,
        checkErrors: playgroundConfig.checkErrors || program.checkErrors,
        randomScenario: playgroundConfig.randomScenario || program.randomScenario,
        timeout: playgroundConfig.timeout || program.timeout,
        reportType: playgroundConfig.reportType || program.reportType,
        reportPath: playgroundConfig.reportPath || program.reportPath,
        angularCliPath: playgroundConfig.angularCli.cmdPath || program.ngCliCmd,
        angularCliPort: parseInt(playgroundConfig.angularCli.port, 10) || program.ngCliPort,
        angularCliEnv: playgroundConfig.angularCli.env || program.ngCliEnv,
        angularCliAdditionalArgs: playgroundConfig.angularCli.args || program.ngCliArgs
    };
}

function loadConfig(path: string) {
    const configPath = resolvePath(path);
    if (!existsSync(configPath)) {
        throw new Error(chalk.red(`Failed to load config file ${configPath}`));
    }

    return require(configPath.replace(/.json$/, ''));
}

