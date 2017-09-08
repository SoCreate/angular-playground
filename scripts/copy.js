const path = require('path');
const fs = require('fs-extra');

const examples = ['example-app-angular-cli', 'example-app-embed-mode', 'example-app-webpack'];

moveDistToExamples(examples)
    .then(() => console.log('Build successfully copied.'))
    .catch(() => console.log('Failed to copy Dist.'));

/////////////////////////////////////////////

function moveDistToExamples(examples) {
    console.log('Copying build to examples...');
    const promises = examples
        .map(examplePath => path.join(__dirname, `../dev/${examplePath}/node_modules/angular-playground/`))
        .map(examplePath => [ copyDist(examplePath), copyPackageFile(examplePath) ])
    return Promise.all(promises);
}

function copyDist(resultPath) {
    return fs.copy(path.join(__dirname, '../dist/'), path.join(resultPath, 'dist/'));
}

function copyPackageFile(resultPath) {
    return fs.copy(path.join(__dirname, '../package.json'), path.join(resultPath, 'package.json'));
}
