'use strict';

var baseCrudTest = require('./base.routes.test'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item');

describe('Item CRUD tests:', function () {
    this.timeout(15000);
    baseCrudTest.perform('/item', 'Please fill Item name', Item, 'name');
});
