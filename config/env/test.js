'use strict';

var app = require('./all').app;

module.exports = {
    port: 3001,
    db: 'mongodb://localhost/' + app.name + "_test"
};
