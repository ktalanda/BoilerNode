'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Core = mongoose.model('Core');

exports.perform = function (route, errorMessage, Element, mainProperty) {
    beforeEach(function (done) {
        done();
    });

    it('should succeed', function(done){
        (5).should.be.exactly(5).and.be.a.Number();
    });
};