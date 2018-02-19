#!/usr/bin/env node
import { run } from './src/run';
run().catch(function(err) {
   process.stderr.write(err.message + "\n");   
   process.exit(err.code);
});
