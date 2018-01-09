import * as program from 'commander';
import chalk from 'chalk';
import { resolve as resolvePath } from 'path';
import { existsSync } from 'fs';
import { REPORT_TYPE } from './error-reporter';

export interface Config {
    sourceRoot: string;
    angularAppName: string;
    chunk: boolean;
    watch: boolean;
    serve: boolean;

    verifySandboxes: boolean;
    randomScenario: boolean;
    timeout: number;
    reportType: string;
    reportPath: string;

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
        .option('--check-errors', '', false)
        .option('--random-scenario', '', false)
        .option('--timeout', '', 90)
        .option('--report-type', '', REPORT_TYPE.LOG)
        .option('--report-path', '')

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
        chunk: negate(playgroundConfig.noChunk) || program.chunk,
        watch: negate(playgroundConfig.noWatch) || program.watch,
        serve: negate(playgroundConfig.noServe) || program.serve,

        verifySandboxes: playgroundConfig.verifySandboxes || program.checkErrors,
        randomScenario: playgroundConfig.randomScenario || program.randomScenario,
        timeout: playgroundConfig.timeout || program.timeout,
        reportPath: playgroundConfig.reportPath || program.reportPath,
        reportType: playgroundConfig.reportType || program.reportType,

        angularAppName: playgroundConfig.angularCli.appName || program.ngCliApp,
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

function negate(value: boolean) {
    if (value === undefined) {
        return value;
    }

    return !value;
}
