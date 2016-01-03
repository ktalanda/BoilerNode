'use strict';

var should = require('should');

exports.perform = function (Element, mainProperty) {
    var element;

    beforeEach(function (done) {
        element = new Element();
        element[mainProperty] = 'Test Value';
        done();
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            element.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            element[mainProperty] = '';
            element.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        element.remove();
        done();
    });
};
