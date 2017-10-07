const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

cleanDist()
    .then(() => console.log('Cleaned build.'))
    .catch((err) => console.log(err));

////////////////////////////////////////////

function cleanDist() {
    return Promise.all([
        fs.remove(path.join(__dirname, '../dist/')),
        fs.remove(path.join(__dirname, '../build/')),
    ]);
}
