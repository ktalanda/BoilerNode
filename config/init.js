'uset strict';

var glob = require('glob'),
    chalk = require('chalk');

module.exports = function () {
    var environmentFiles = glob(
        './config/env/' + process.env.NODE_ENV + '.js',
        {sync: true}
    );

    if (!environmentFiles.length) {
        if (process.env.NODE_ENV) {
            console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
        } else {
            console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
        }
        process.env.NODE_ENV = 'development';
    } else {
        console.log(chalk.black.bgWhite('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'));
    }
};