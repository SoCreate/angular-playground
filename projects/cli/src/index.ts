#!/usr/bin/env node
import { run } from './run';
const chalk = require('chalk');

(async () => {
    try {
        await run();
    } catch (err) {
        console.error(chalk.red(err.message));
        process.exit(1);
    }
})();

