import * as program from 'commander';
import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { existsSync } from 'fs';

export interface Config {
    sourceRoot: string;
    angularAppName: string;
    noChunk: boolean;
    noWatch: boolean;
    noServe: boolean;
    verifySandboxes: boolean;
    angularCliPath: string;
    angularCliPort: number;
    angularCliEnv: string | undefined;
    angularCliAdditionalArgs: string[];
}

export function configure(argv: any): Config {
    program
        .name('angular-playground')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directory', './src/')

        // Build options
        .option('--no-watch', 'Disable sandboxes watch', false)
        .option('--no-serve', 'Disable cli serve', false)
        .option('--no-chunk', 'Don\'t chunk sandbox files individually', false)

        // Sandbox verification
        .option('--verify', '', false)

        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-env <path>', 'Path to @angular/cli environment')
        .option('--ng-cli-port <n>', '@angular/cli serve port', 4201)
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable', 'node_modules/@angular/cli/bin/ng')
        .option('--ng-cli-args <list>', 'Additional @angular/cli arguments');

    program.parse(argv);
    return applyConfigurationFile(program);
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
        verifySandboxes: playgroundConfig.verifySandboxes || program.verify,
        angularCliPath: playgroundConfig.angularCli.cmdPath || program.ngCliCmd,
        angularCliPort: playgroundConfig.angularCli.port || program.ngCliPort,
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
