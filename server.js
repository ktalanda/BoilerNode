'use strict';

var init = require('./config/init')(),
    config = require('./config/config'),
    chalk = require('chalk'),
    db = require('./config/db'),
    app = require('./config/express')();

app.listen(config.port);

exports = module.exports = app;

console.log('BoilerNode application has started on port ' + config.port);