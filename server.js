'use strict';

var init = require('./config/init')();
var config = require('./config/config');
var chalk = require('chalk');
var app = require('./config/express')();

app.listen(config.port);

exports = module.exports = app;

console.log('BoilerNode application has started on port ' + config.port);