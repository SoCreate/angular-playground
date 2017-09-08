const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

Promise.all([cleanDist(), cleanMetadata()])
    .then(() => console.log('Cleaned build.'))
    .catch((err) => console.log(err));

////////////////////////////////////////////

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
