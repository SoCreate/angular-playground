import * as program from 'commander';

export function run() {
    program
        .name('angular-playground')
        .version('3.2.0')
        .option('-C, --config <path>', 'Configuration file')
        .option('-S, --src <path>', 'Specify component source directory')
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
        .option('--ng-cli-env <path>', '@angular/cli environment')
        .option('--ng-cli-port <n>', '@angular/cli serve port')
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable')
        .parse(process.argv);
    console.log(program);
}
