'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../../server'),
    agent = request.agent(app),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.perform = function (route, errorMessage, Element, mainProperty) {
    var element,
        user;

    var signin = function (credentials, callback, done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        // Save a user to the test db and create new Currency
        user.save(function () {
            agent.post('/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (signinErr, signinRes) {
                    if (signinErr) done(signinErr);
                    else callback();
                });
        });
    };

    var signout = function (callback, done) {
        agent.get('/auth/signout')
            .expect(200)
            .end(function (signoutErr) {
                if (signoutErr) done(signoutErr);
                else {
                    callback();
                }
            });
    };

    beforeEach(function (done) {
        element = {};
        element[mainProperty] = 'Test Value';

        var credentials = {
            username: 'username',
            password: 'password'
        };
        // Create a new user
        signin(credentials, function () {
            done();
        }, done);
    });

    it('should be able to save instance if logged in', function (done) {
        agent.post(route)
            .send(element)
            .expect(200)
            .end(function (saveErr, saveRes) {
                if (saveErr) done(saveErr);
                else {
                    Element.findById(saveRes.body._id).exec(function (mongoErr, mongoRes) {
                        if (mongoErr) done(mongoErr);
                        else {
                            (mongoRes[mainProperty]).should.match('Test Value');
                            done();
                        }
                    });
                }
            });
    });

    it('should not be able to save instance if not logged in', function (done) {
        agent.get('/auth/signout')
            .expect(200)
            .end(function (signoutErr) {
                if (signoutErr) done(signoutErr);
                else {
                    agent.post(route)
                        .send(element)
                        .expect(401)
                        .end(function (err) {
                            if (err) done(err);
                            else done();

                        });
                }
            });
    });

    it('should not be able to save instance if no ' + mainProperty + ' is provided', function (done) {
        element[mainProperty] = '';
        agent.post(route)
            .send(element)
            .expect(400)
            .end(function (err, res) {
                if (err) done(err);
                else {
                    (res.body.message).should.match(errorMessage);
                    done();
                }
            });
    });

    it('should be able to update instance if logged in', function (done) {
        var new_value = 'NEW_VALUE';
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            element[mainProperty] = new_value;
            agent.put(route + '/' + object._id)
                .send(element)
                .expect(200)
                .end(function (updateErr, updateRes) {
                    if (updateErr) done(updateErr);
                    else {
                        (updateRes.body._id).should.equal(updateRes.body._id);
                        (updateRes.body[mainProperty]).should.match(new_value);
                        done();
                    }
                });
        });
    });

    it('should not be able to update instance if not logged in', function (done) {
        signout(function () {
            agent.put(route + '/' + '568cde4397b6c84d0d03ad18')
                .send(element)
                .expect(401)
                .end(function (updateErr) {
                    if (updateErr) done(updateErr);
                    else done();
                });
        }, done);
    });

    it('should not be able to update instance associated with different user', function(done){
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            var credentials = {
                username: 'username_1',
                password: 'password_1'
            };
            signin(credentials, function () {
                agent.put(route + '/' + object._id)
                    .send(element)
                    .expect(400)
                    .end(function (err) {
                        if (err) done(err);
                        else done();
                    });
            });
        });

    });

    it('should be able to get a list of instances if logged in', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            agent.get(route)
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                        done();
                    }
                });
        });
    });

    it('should not be able to get a list of instances if not logged in', function (done) {
        var object = new Element(element);
        object.user = user;
        signout(function () {
            object.save(function () {
                agent.get(route)
                    .expect(401)
                    .end(function (err, res) {
                        if (err) done(err);
                        else done();
                    });
            });
        }, done);
    });

    it('should get list of elements associated with different user', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            var credentials = {
                username: 'username_1',
                password: 'password_1'
            };
            signin(credentials, function () {
                agent.get(route)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        else {
                            res.body.should.be.instanceof(Array).and.have.lengthOf(0);
                            done();
                        }
                    });
            });
        });
    });

    it('should be able to get a single instance if logged in', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            agent.get(route + '/' + object._id)
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        res.body.should.be.an.instanceOf(Object).and.have.property(mainProperty, element[mainProperty]);
                        done();
                    }
                });
        });
    });

    it('should not be able to get a single instance if not logged in', function (done) {
        signout(function () {
            var object = new Element(element);
            object.user = user;
            object.save(function () {
                agent.get(route + '/' + object._id)
                    .expect(401)
                    .end(function (err) {
                        if (err) done(err);
                        else done();
                    });
            });
        }, done);
    });

    it('should not be able to get an instance of element associated with different', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            var credentials = {
                username: 'username_1',
                password: 'password_1'
            };
            signin(credentials, function () {
                agent.get(route + '/' + object._id)
                    .expect(200)
                    .end(function (err, res) {
                        if (res.body !== null) err = new Error('expected no instance returned');
                        if (err) done(err);
                        else done();
                    });
            });
        });


    });

    it('should be able to delete instance ', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            agent.delete(route + '/' + object._id)
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        res.body.should.be.an.instanceOf(Object).and.have.property(mainProperty, element[mainProperty]);
                        done();
                    }
                });
        });
    });

    it('should not be able to delete instance if not logged in', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            signout(function () {
                agent.delete(route + '/' + object._id)
                    .expect(401)
                    .end(function (err, res) {
                        if (err) done(err);
                        else done();
                    });
            }, done);
        });
    });

    it('should not be able to delete instance associated with different user', function (done) {
        var object = new Element(element);
        object.user = user;
        object.save(function () {
            var credentials = {
                username: 'username_1',
                password: 'password_1'
            };
            signin(credentials, function () {
                agent.delete(route + '/' + object._id)
                    .expect(400)
                    .end(function (err) {
                        if (err) done(err);
                        else done();

                    });
            });
        });
    });

    afterEach(function (done) {
        Element.remove().exec();
        agent.get('/auth/signout');
        User.remove().exec();
        done();
    });
};
