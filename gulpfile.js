var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

gulp.task('default', ['lint', 'development']);
gulp.task('deploy', ['lint', 'production']);

gulp.task('development', function () {
    nodemon({
        script: 'server.js',
        env: {'NODE_ENV': 'development'}
    });
});

gulp.task('production', function () {
    nodemon({
        script: 'server.js',
        env: {'NODE_ENV': 'production'}
    });
});

gulp.task('secure', function () {
    nodemon({
        script: 'server.js',
        env: {'NODE_ENV': 'secure'}
    });
});

gulp.task('test', function () {
    nodemon({
        script: 'server.js',
        env: {'NODE_ENV': 'test'}
    });
});

gulp.task('lint', function () {
    return gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});