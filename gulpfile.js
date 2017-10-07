const gulp = require('gulp');
const inlineNg2Template = require('gulp-inline-ng2-template');
const exec = require('child_process').exec;

gulp.task('inline', () => {
    return gulp.src('./src/**/*.ts')
        .pipe(inlineNg2Template({ base: '/src/app' }))
        .pipe(gulp.dest('./build'));
});

gulp.task('aot', (cb) => {
    exec('ngc -p ./tsconfig.json', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('build', ['inline', 'aot']);