import * as commander from 'commander';
import { resolve as resolvePath } from 'path';
import { existsSync } from 'fs';
import { REPORT_TYPE } from './error-reporter';

export interface Config {
    sourceRoots: string[];
    chunk: boolean;
    watch: boolean;
    serve: boolean;
    buildWithServiceWorkers: boolean;
    baseHref: string;

    verifySandboxes: boolean;
    randomScenario: boolean;
    timeout: number;
    reportType: string;
    reportPath: string;

    checkVisualRegressions: boolean;
    snapshotDirectory: string;
    diffDirectory: string;
    updateSnapshots: boolean;
    deleteSnapshots: boolean;
    pathToSandboxes: string;
    imageSnapshotConfig: { [key: string]: any};

    angularAppName?: string;
    angularCliPath?: string;
    angularCliHost?: string;
    angularCliPort?: number;
    angularCliAdditionalArgs?: string[];
    angularCliMaxBuffer?: number;
}

const splitCommaSeparatedList = (value) => {
    if (!value) {
        return ['./src/'];
    }
    return value.split(',');
};

export function configure(argv: any): Config {
    commander
        .name('angular-playground')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directories (comma separated list)', splitCommaSeparatedList)

        // Build options
        .option('--no-watch', 'Disable sandboxes watch', false)
        .option('--no-serve', 'Disable cli serve', false)
        .option('--no-chunk', 'Don\'t chunk sandbox files individually', false)
        .option('--build', 'Build your sandboxes with service workers enabled. Requires @angular/service-worker', false)
        .option('--base-href <href>', 'Specify a base-href for @angular/cli build', '/')

        // Sandbox verification
        .option('--check-errors', 'Check for errors in all scenarios in all sandboxes', false)
        .option('--random-scenario', 'Pick a random scenario from each sandbox to check for errors', false)
        .option('--timeout <n>', 'Number of attempts for each sandbox', 90)
        .option('--report-type <type>', 'Type of report to generate', REPORT_TYPE.LOG)
        .option('--report-path <path>', 'Path of report to generate', '')

        // Snapshot tests
        .option('--check-visual-regressions', 'Run visual regression tests', false)
        .option('--snapshot-directory <dir>', 'Directory to store snapshots in', 'src/__images_snapshots__')
        .option('--diff-directory <dir>', 'Directory to put diffs in', 'src/__diff_output__')
        .option('--update-snapshots', 'Update stored snapshots', false)
        .option('--delete-snapshots', 'Delete stored snapshots', false)
        .option('--path-to-sandboxes <dir>', 'Subdirectory of project in which to target sandbox files', '')

        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-host <ip>', '@angular/cli serve host ip', '127.0.0.1')
        .option('--ng-cli-port <n>', '@angular/cli serve port', 4201)
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable', 'node_modules/@angular/cli/bin/ng')
        .option('--ng-cli-args <list>', 'Additional @angular/cli arguments')
        .option('--ng-cli-max-buffer <maxBuffer>', 'Specify a max buffer (for large apps)');

    commander.parse(argv);
    return applyConfigurationFile(commander);
}

export function applyConfigurationFile(program: any): Config {
    const playgroundConfig = loadConfig(program.config);
    // TODO: remove this deprecation warning at next major version
    if (playgroundConfig.sourceRoot) {
        console.warn('Using `sourceRoot` is deprecated. Please use `sourceRoots` instead.');
        console.warn('See https://angularplayground.it/docs/api/configuration for more info.');
        playgroundConfig.sourceRoots = [playgroundConfig.sourceRoot];
    }

    const config: Config = {
        sourceRoots: playgroundConfig.sourceRoots || program.src,
        chunk: negate(playgroundConfig.noChunk) || program.chunk,
        watch: negate(playgroundConfig.noWatch) || program.watch,
        serve: negate(playgroundConfig.noServe) || program.serve,
        buildWithServiceWorkers: playgroundConfig.build || program.build,
        baseHref: playgroundConfig.baseHref || program.baseHref,

        verifySandboxes: playgroundConfig.verifySandboxes || program.checkErrors,
        randomScenario: playgroundConfig.randomScenario || program.randomScenario,
        timeout: playgroundConfig.timeout || program.timeout,
        reportPath: playgroundConfig.reportPath || program.reportPath,
        reportType: playgroundConfig.reportType || program.reportType,

        checkVisualRegressions: playgroundConfig.checkVisualRegressions || program.checkVisualRegressions,
        snapshotDirectory: playgroundConfig.snapshotDirectory || program.snapshotDirectory,
        diffDirectory: playgroundConfig.diffDirectory || program.diffDirectory,
        updateSnapshots: playgroundConfig.updateSnapshots || program.updateSnapshots,
        deleteSnapshots: playgroundConfig.deleteSnapshots || program.deleteSnapshots,
        pathToSandboxes: playgroundConfig.pathToSandboxes || program.pathToSandboxes,
        imageSnapshotConfig: playgroundConfig.imageSnapshotConfig || {},
    };

    if (config.verifySandboxes && config.reportType && !config.reportPath) {
        switch (config.reportType) {
            case REPORT_TYPE.JSON:
                config.reportPath = './sandbox.report.json';
                break;
            case REPORT_TYPE.XML:
                config.reportPath = './sandbox.report.xml';
                break;
        }
    }

    if (playgroundConfig.angularCli) {
        config.angularAppName = playgroundConfig.angularCli.appName || program.ngCliApp;
        config.angularCliPath = playgroundConfig.angularCli.cmdPath || program.ngCliCmd;
        config.angularCliHost = playgroundConfig.angularCli.host || program.ngCliHost;
        config.angularCliPort = playgroundConfig.angularCli.port || program.ngCliPort;
        config.angularCliAdditionalArgs = playgroundConfig.angularCli.args || program.ngCliArgs;
        config.angularCliMaxBuffer = playgroundConfig.angularCli.maxBuffer || program.ngCliMaxBuffer;
    }

    return config;
}

function loadConfig(path: string) {
    const configPath = resolvePath(path);
    if (!existsSync(configPath)) {
        throw new Error(`Failed to load config file ${configPath}`);
    }

    return require(configPath.replace(/.json$/, ''));
}

function negate(value: boolean) {
    if (value === undefined) {
        return value;
    }

    return !value;
}
