import chalk from 'chalk';
import { exec } from 'child_process';

export function buildAngularCli() {
    try {
        require.resolve('@angular/service-worker');
        console.log('Building with sandboxes...');
        exec('ng build --prod', (err, stdout, stderr) => {
            if (err) throw err;
            console.log(stdout);
        });
    } catch (err) {
        console.error(chalk.red('Error: --build requires @angular/service-worker to be installed locally.'));
        console.log('https://github.com/angular/angular-cli/wiki/build#service-worker');
        process.exit(1);
    }
}
