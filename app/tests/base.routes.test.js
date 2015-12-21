'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    agent = request.agent(app),
    mongoose = require('mongoose');

exports.perform = function (route, errorMessage, Element, mainProperty) {
    var element;

    beforeEach(function (done) {
        element = {};
        element[mainProperty] = 'Test Value';
        done();
    });

    it('should be able to save instance', function (done) {
        agent.post(route)
            .send(element)
            .expect(200)
            .end(function (saveErr, saveRes) {
                if (saveErr) done(saveErr);
                agent.get(route)
                    .end(function (getErr, getRes) {
                        if (getErr) done(getErr);
                        var elements = getRes.body;
                        (elements[0][mainProperty]).should.match('Test Value');
                        done();
                    });
            });
    });

    it('should not be able to save instance if no ' + mainProperty + ' is provided', function (done) {
        element[mainProperty] = '';
        agent.post(route)
            .send(element)
            .expect(400)
            .end(function (saveErr, saveRes) {
                (saveRes.body.message).should.match(errorMessage);
                done(saveErr);
            });
    });

    it('should be able to update instance', function (done) {

        agent.post(route)
            .send(element)
            .expect(200)
            .end(function (saveErr, saveRes) {
                if (saveErr) done(saveErr);
                element[mainProperty] = 'WHY YOU GOTTA BE SO MEAN?';
                agent.put(route + '/' + saveRes.body._id)
                    .send(element)
                    .expect(200)
                    .end(function (updateErr, updateRes) {
                        if (updateErr) done(updateErr);
                        (updateRes.body._id).should.equal(updateRes.body._id);
                        (updateRes.body[mainProperty]).should.match('WHY YOU GOTTA BE SO MEAN?');
                        done();
                    });
            });
    });

    it('should be able to get a list of instances', function (done) {

        var object = new Element(element);
        object.save(function () {
            agent.get(route)
                .expect(200)
                .end(function (req, res) {
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                    done();
                });
        });

    });

    it('should be able to get a single instance', function (done) {
        var object = new Element(element);
        object.save(function () {
            agent.get(route + '/' + object._id)
                .end(function (req, res) {
                    res.body.should.be.an.instanceOf(Object).and.have.property(mainProperty, element[mainProperty]);
                    done();
                });
        });
    });

    it('should be able to delete instance ', function (done) {
        var object = new Element(element);
        object.save(function () {
            agent.delete(route + '/' + object._id)
                .expect(200)
                .end(function (deleteErr, deleteRes) {
                    deleteRes.body.should.be.an.instanceOf(Object).and.have.property(mainProperty, element[mainProperty]);
                    done(deleteErr);
                });
        });
    });

    afterEach(function (done) {
        Element.remove().exec();
        done();
    });
};
