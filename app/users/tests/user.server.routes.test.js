'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    agent = request.agent(app);

var credentials, user, credentials_2, adminCredentials, admin;

describe('User Routes Tests', function () {
    beforeEach(function (done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'password'
        };
        credentials_2 = {
            firstName: 'TEST',
            lastName: 'TEST',
            displayName: 'TEST TEST',
            email: 'test_1@test.com',
            username: 'username_1',
            password: 'password',
            provider: 'local'
        };
        adminCredentials = {
            username: 'admin',
            password: 'password'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });
        admin = new User({
            firstName: 'Admin',
            lastName: 'Admin',
            displayName: 'Admin',
            email: 'admin@test.com',
            username: adminCredentials.username,
            password: adminCredentials.password,
            provider: 'local',
            roles: ['admin']
        });

        // Save a user to the test db and create new Currency
        var isUserDone = false;
        var isAdminDone = false;
        user.save(function () {
            isUserDone = true;
            if (isUserDone && isAdminDone) {
                done();
            }
        });
        admin.save(function () {
            isAdminDone = true;
            if (isUserDone && isAdminDone) {
                done();
            }
        });
    });

    var signin = function (inCredentials, callback, done) {
        agent.post('/auth/signin')
            .send(inCredentials)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                else {
                    callback(res.body);
                }
            });
    };

    var signout = function (callback, done) {
        agent.get('/auth/signout')
            .expect(200)
            .end(function (err) {
                if (err) done(err);
                else {
                    callback();
                }
            });
    };

    it('should be able to SignIn', function (done) {
        signin(credentials, function () {
            done();
        }, done);
    });

    it('should be able to SignOut', function (done) {
        signin(credentials, function () {
            signout(function () {
                done();
            }, done);
        }, done);
    });

    it('should be able to SignUp', function (done) {
        agent.post('/auth/signup')
            .send(credentials_2)
            .expect(200)
            .end(function (err) {
                if (err) done(err);
                else done();
            });
    });

    it('should be able to get your data as User', function (done) {
        signin(credentials, function (user) {
            agent.get('/users/me')
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        if (res.body._id !== user._id) done(new Error('Wrong credentials returned'));
                        else done();
                    }
                });
        }, done);
    });

    it('should be able to get user list as Admin', function (done) {
        signin(adminCredentials, function () {
            agent.get('/users')
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        res.body.should.be.instanceof(Array).and.have.lengthOf(2);
                        done();
                    }
                });
        }, done);
    });

    it('should not be able to get user list if not logged in', function (done) {
        agent.get('/users')
            .expect(401)
            .end(function (err) {
                if (err) done(err);
                else done();

            });
    });

    it('should not be able to get user list as User', function (done) {
        signin(credentials, function () {
            agent.get('/users')
                .expect(403)
                .end(function (err) {
                    if (err) done(err);
                    else done();
                });
        }, done);
    });

    it('should be able to create an user as Admin', function (done) {
        signin(adminCredentials, function () {
            agent.post('/users')
                .send(credentials_2)
                .expect(200)
                .end(function (err) {
                    if (err) done(err);
                    else done();
                });
        }, done);
    });

    it('should not be able to create an user if not logged in', function (done) {
        agent.post('/users')
            .send(credentials_2)
            .expect(401)
            .end(function (err) {
                if (err) done(err);
                else done();
            });
    });

    it('should not be able to create an user as User', function (done) {
        signin(credentials, function () {
            agent.post('/users')
                .send(credentials_2)
                .expect(403)
                .end(function (err) {
                    if (err) done(err);
                    else done();
                });
        });

    });

    it('should be able to update user with as Admin', function (done) {
        signin(adminCredentials, function () {
            var new_value = 'NEW_NAME';
            var updateCredentials = {
                firstName: new_value
            };
            agent.put('/users/' + user._id)
                .send(updateCredentials)
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        (res.body.firstName).should.match(new_value);
                        done();
                    }
                });
        });
    });

    it('should not be able to update user if not logged in', function (done) {
        var new_value = 'NEW_NAME';
        var updateCredentials = {
            firstName: new_value
        };
        agent.put('/users/' + user._id)
            .send(updateCredentials)
            .expect(401)
            .end(function (err, res) {
                if (err) done(err);
                else done();

            });
    });

    it('should not be able to update different user as User', function (done) {
        signin(credentials, function () {
            var new_value = 'NEW_NAME';
            var updateCredentials = {
                firstName: new_value
            };
            agent.put('/users/' + user._id)
                .send(updateCredentials)
                .expect(403)
                .end(function (err, res) {
                    if (err) done(err);
                    else done();

                });
        });
    });

    it('should be able to update own data as User', function (done) {
        signin(credentials, function () {
            var new_value = 'NEW_NAME';
            var updateCredentials = {
                firstName: new_value
            };
            agent.put('/users')
                .send(updateCredentials)
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    else {
                        (res.body.firstName).should.match(new_value);
                        done();
                    }
                });
        });
    });

    it('should be able to delete user as Admin', function (done) {
        signin(adminCredentials, function () {
            agent.delete('/users/' + user._id)
                .expect(200)
                .end(function (err) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    it('should not be able to delete user if not logged in', function (done) {
        agent.delete('/users/' + user._id)
            .expect(401)
            .end(function (err) {
                if (err) done(err);
                else done();
            });
    });

    it('should not be able to delete user as User', function (done) {
        signin(credentials, function () {
            agent.delete('/users/' + user._id)
                .expect(403)
                .end(function (err) {
                    if (err) done(err);
                    else done();
                });
        });
    });

    afterEach(function (done) {
        User.remove().exec();
        done();
    });
});
