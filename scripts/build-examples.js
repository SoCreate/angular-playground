const path = require('path');
const fs = require('fs-extra');

const examples = ['example-app-angular-cli', 'example-app-embed-mode', 'example-app-webpack'];

console.log('Copying build to examples...');
examples.forEach(examplePath => {
    const resultPath = path.join(__dirname, `../${examplePath}/node_modules/angular-playground/`);

    Promise.all([copyDist(resultPath), copyPackageFile(resultPath)])
        .then(() => console.log('dist/ successfully copied to', resultPath));

});

function copyDist(resultPath) {
    return fs.copy(path.join(__dirname, '../dist/'), path.join(resultPath, 'dist/'));
}

function copyPackageFile(resultPath) {
    return fs.copy(path.join(__dirname, '../package.json'), path.join(resultPath, 'package.json'));
}