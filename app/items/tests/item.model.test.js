'use strict';

var
    baseModelTest = require('../../base/tests/base.model.test'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item');

describe('Item Model Unit Tests:', function () {
    baseModelTest.perform(Item, 'name');
});
