'use strict';

var app = require('./all').app;

module.exports = {
    db: 'mongodb://localhost/' + app.name
};