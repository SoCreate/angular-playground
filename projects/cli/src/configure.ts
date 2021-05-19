import { Command } from 'commander';
import { resolve as resolvePath } from 'path';
import { existsSync } from 'fs';
import { REPORT_TYPE } from './error-reporter';
import { ViewportOptions } from './check-snapshots';

export interface Config {
    sourceRoots: string[];
    chunk: boolean;
    watch: boolean;
    serve: boolean;
    build: boolean;
    buildWithServiceWorker: boolean;
    baseHref: string;

    verifySandboxes: boolean;
    randomScenario: boolean;
    timeout: number;
    reportType: string;
    reportPath: string;

    checkVisualRegressions: boolean;
    snapshotDirectory: string;
    diffDirectory: string;
    viewportSizes: ViewportOptions[];
    updateSnapshots: boolean;
    deleteSnapshots: boolean;
    imageSnapshotConfig: { [key: string]: any};
    visualRegressionIgnore: Array<{ regex: string, flags?: string }>;
    visualRegressionMockDate: number; // date in ms
    visualRegressionSleepDuration: number;

    pathToSandboxes: [];

    angularAppName?: string;
    angularCliPath?: string;
    angularCliHost?: string;
    angularCliPort?: number;
    angularCliAdditionalArgs?: string[];
    angularCliMaxBuffer?: number;
}

const splitCommaSeparatedList = (value, defaultValue = []) => {
    if (!value) {
        return defaultValue;
    }
    return value.split(',');
};

export function configure(argv: any): Config {
    const program = new Command();
    program
        .name('angular-playground')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directories (comma separated list)', (v) => splitCommaSeparatedList(v, ['./src/']))

        // Build options
        .option('--no-watch', 'Disable sandboxes watch', false)
        .option('--no-serve', 'Disable cli serve', false)
        .option('--no-chunk', 'Don\'t chunk sandbox files individually', false)
        .option('--build', 'Build your sandboxes for production with service workers disabled.', false)
        .option('--build-with-service-worker', 'Build your sandboxes with service workers enabled. Requires @angular/service-worker', false)
        .option('--base-href <href>', 'Specify a base-href for @angular/cli build', '/')

        // Sandbox verification
        .option('--check-errors', 'Check for errors in all scenarios in all sandboxes', false)
        .option('--random-scenario', 'Pick a random scenario from each sandbox to check for errors', false)
        .option('--timeout <n>', 'Number of attempts for each sandbox', '90')
        .option('--report-type <type>', 'Type of report to generate', REPORT_TYPE.LOG)
        .option('--report-path <path>', 'Path of report to generate', '')

        // Snapshot tests
        .option('--check-visual-regressions', 'Run visual regression tests', false)
        .option('--snapshot-directory <dir>', 'Directory to store snapshots in', 'src/__images_snapshots__')
        .option('--diff-directory <dir>', 'Directory to put diffs in', 'src/__diff_output__')
        .option('--update-snapshots', 'Update stored snapshots', false)
        .option('--delete-snapshots', 'Delete stored snapshots', false)
        .option('--visual-regression-mock-date <dateInMs>', 'Date to set in puppeteer (in ms from epoch) for visual regression tests.', `${Date.now()}`)
        .option('--visual-regression-sleep-duration <n>', 'Milliseconds to wait for sandbox scenario to load before capturing screenshot.', '100')

        // Sandbox verification and Snapshot tests
        .option('--path-to-sandboxes <dir>', 'Subdirectory of project in which to target sandbox files', splitCommaSeparatedList)

        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-host <ip>', '@angular/cli serve host ip', '127.0.0.1')
        .option('--ng-cli-port <n>', '@angular/cli serve port', '4201')
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable', 'node_modules/@angular/cli/bin/ng')
        .option('--ng-cli-args <list>', 'Additional @angular/cli arguments')
        .option('--ng-cli-max-buffer <maxBuffer>', 'Specify a max buffer (for large apps)');

    program.parse(argv);
    return applyConfigurationFile(program.opts());
}

export function applyConfigurationFile(options: {[key: string]: any}): Config {
    const playgroundConfig = loadConfig(options.config);
    // TODO: remove this deprecation warning at next major version
    if (playgroundConfig.sourceRoot) {
        console.warn('Using `sourceRoot` is deprecated. Please use `sourceRoots` instead.');
        console.warn('See https://angularplayground.it/docs/api/configuration for more info.');
        playgroundConfig.sourceRoots = [playgroundConfig.sourceRoot];
    }

    const config: Config = {
        sourceRoots: playgroundConfig.sourceRoots || options.src,
        chunk: negate(playgroundConfig.noChunk) || options.chunk,
        watch: negate(playgroundConfig.noWatch) || options.watch,
        serve: negate(playgroundConfig.noServe) || options.serve,
        build: playgroundConfig.build || options.build,
        buildWithServiceWorker: playgroundConfig.buildWithServiceWorker || options.buildWithServiceWorker,
        baseHref: playgroundConfig.baseHref || options.baseHref,

        verifySandboxes: playgroundConfig.verifySandboxes || options.checkErrors,
        randomScenario: playgroundConfig.randomScenario || options.randomScenario,
        timeout: playgroundConfig.timeout || options.timeout,
        reportPath: playgroundConfig.reportPath || options.reportPath,
        reportType: playgroundConfig.reportType || options.reportType,

        checkVisualRegressions: playgroundConfig.checkVisualRegressions || options.checkVisualRegressions,
        snapshotDirectory: playgroundConfig.snapshotDirectory || options.snapshotDirectory,
        diffDirectory: playgroundConfig.diffDirectory || options.diffDirectory,
        viewportSizes: playgroundConfig.viewportSizes || [],
        updateSnapshots: playgroundConfig.updateSnapshots || options.updateSnapshots,
        deleteSnapshots: playgroundConfig.deleteSnapshots || options.deleteSnapshots,
        imageSnapshotConfig: playgroundConfig.imageSnapshotConfig || {},
        visualRegressionIgnore: playgroundConfig.visualRegressionIgnore || [],
        visualRegressionMockDate: playgroundConfig.visualRegressionMockDate || options.visualRegressionMockDate,
        visualRegressionSleepDuration: playgroundConfig.visualRegressionSleepDuration || options.visualRegressionSleepDuration,

        pathToSandboxes: playgroundConfig.pathToSandboxes || options.pathToSandboxes,
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
        config.angularAppName = playgroundConfig.angularCli.appName || options.ngCliApp;
        config.angularCliPath = playgroundConfig.angularCli.cmdPath || options.ngCliCmd;
        config.angularCliHost = playgroundConfig.angularCli.host || options.ngCliHost;
        config.angularCliPort = playgroundConfig.angularCli.port || options.ngCliPort;
        config.angularCliAdditionalArgs = playgroundConfig.angularCli.args || options.ngCliArgs;
        config.angularCliMaxBuffer = playgroundConfig.angularCli.maxBuffer || options.ngCliMaxBuffer;
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
