const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

const examples = ['example-app-angular-cli', 'example-app-embed-mode', 'example-app-webpack'];

// Promise.all([cleanDist(), cleanMetadata()])
//     .then(() => console.log('Cleaned build.'))
//     .catch((err) => console.log(err));

moveDistToExamples()
    .then(() => console.log('Build successfully copied.'))
    .catch(() => console.log('Failed to copy Dist.'));

function moveDistToExamples() {
    console.log('Copying build to examples...');
    const promises = examples
        .map(examplePath => path.join(__dirname, `../${examplePath}/node_modules/angular-playground/`))
        .map(examplePath => [ copyDist(examplePath), copyPackageFile(examplePath) ])
    return Promise.all(promises);
}

function cleanDist() {
    return fs.remove(path.join(__dirname, '../dist/'));
}

function cleanMetadata() {
    const metadata = [
        path.join(__dirname, '../src/**/*.ngfactory.ts'),
        path.join(__dirname, '../src/**/*.ngsummary.json')
    ];

    let promises = [];
    metadata.forEach(path => {
        const patternMatches = glob(path, (err, files) => {
            files.forEach(file => promises.push(fs.removeSync(file)));
        });
    });

    return Promise.all(promises);
}

function copyDist(resultPath) {
    return fs.copy(path.join(__dirname, '../dist/'), path.join(resultPath, 'dist/'));
}

function copyPackageFile(resultPath) {
    return fs.copy(path.join(__dirname, '../package.json'), path.join(resultPath, 'package.json'));
}