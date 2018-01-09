const gulp = require('gulp');
const inlineNg2Template = require('gulp-inline-ng2-template');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const exec = require('child_process').exec;

module.exports = () => {
    gulp.task('clean', () => {
        return Promise.all([
            fs.remove(path.join(__dirname, './dist/')),
            fs.remove(path.join(__dirname, './packages/core/build/')),
        ]);
    });

    gulp.task('inline', ['clean'], () => {
        return gulp.src('./packages/core/src/**/*.ts')
            .pipe(inlineNg2Template({ base: '/packages/core/src' }))
            .pipe(gulp.dest('./packages/core/build'));
    });

    gulp.task('aot', ['inline'], (cb) => {
        exec('ngc -p ./packages/core/tsconfig.json', (err, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });

    gulp.task('move', ['aot'], (cb) => {
        fs.moveSync('./dist/packages/core/', './dist/');
        fs.removeSync('./dist/packages/');
        cb();
    });

    gulp.task('build', ['move']);
};
