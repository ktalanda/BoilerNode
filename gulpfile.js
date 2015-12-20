var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', ['development']);

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