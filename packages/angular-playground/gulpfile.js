const gulp = require('gulp');
const inlineNg2Template = require('gulp-inline-ng2-template');
const path = require('path');
const del = require('del');
const exec = require('child_process').exec;

function clean() {
    return del([
        path.join(__dirname, './dist/'),
        path.join(__dirname, './build/')
    ]);
}

function inline() {
    return gulp.src('./core/**/*.ts')
        .pipe(inlineNg2Template({ base: '/core/src' }))
        .pipe(gulp.dest('./build/'));
}

function aot(cb) {
    exec('ngc -p ./tsconfig.json', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

const build = gulp.series(clean, inline, aot);
exports.build = build;
