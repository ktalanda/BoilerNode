'use strict';

var mongoose = require('mongoose'),
    config = require('./config'),
    chalk = require('chalk');

module.exports = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});