'use strict';

var app = require('./all').app;

module.exports = {
    port: 443,
    db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/' + app.name
};