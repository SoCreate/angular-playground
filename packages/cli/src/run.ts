import * as program from 'commander';
import { applyConfigurationFile } from './apply-configuration-file';

export function run() {
    program
        .name('angular-playground')
        .version('3.2.0')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directory', './src/')

        // Build options
        .option('--no-watch', 'Disable sandboxes watch')
        .option('--no-serve', 'Disable cli serve')
        .option('--no-chunk', 'Don\'t chunk sandbox files individually')

        // Verify sandboxes options
        .option('--check-errors', 'Check sandboxes for errors in Chromium')
        .option('--random-scenario', 'Used with --check-errors, pick a random scenario for each sandbox')
        .option('--timeout', 'Timeout interval for --check-errors')
        .option('--report-type', 'Type of --check-errors output report')
        .option('--report-path', 'File path for --check-errors report output')

        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-env <path>', 'Path to @angular/cli environment')
        .option('--ng-cli-port <n>', '@angular/cli serve port', 4201)
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable');

    program.parse(process.argv);
    applyConfigurationFile(program);
}
