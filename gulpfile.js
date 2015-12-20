var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    mocha = require('gulp-mocha');

gulp.task('default', ['lint', 'mocha', 'development']);
gulp.task('deploy', ['lint', 'mocha', 'production']);

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

gulp.task('lint', function () {
    return gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('mocha', function () {
    return gulp.src('app/tests/**/*.js')
        .pipe(mocha());
});