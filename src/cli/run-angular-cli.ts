const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

export const runAngularCli = (angularCliConfig) => {
  let port = angularCliConfig.port ? angularCliConfig.port : 4201;
  let cliPath = 'node_modules/@angular/cli/bin/ng';
  try{
    fs.accessSync(path.resolve(cliPath));
  } catch (e) {
    cliPath = 'node_modules/angular-cli/bin/ng';
  }
  let args = [cliPath, 'serve', '-no-progress'];
  args.push('--port');
  args.push(port.toString());
  if (angularCliConfig.appName) {
    args.push(`-a=${angularCliConfig.appName}`);
  }
  const ngServe = childProcess.spawn('node', args, {maxBuffer: 1024 * 500});
  ngServe.stdout.on('data', (data) => {
    write(process.stdout, data);
  });
  ngServe.stderr.on('data', (data) => {
    write(process.stderr, data);
  });

  function write(handler, data) {
    let message = data.toString();
    handler.write(`[ng serve]: ${message}\n`);
  }
};
