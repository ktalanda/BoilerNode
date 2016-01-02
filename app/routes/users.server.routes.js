'use strict';

var passport = require('passport');

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');

    // Setting up the users authentication api
    app.route('/auth/signup').post(users.signup);
    app.route('/auth/signin').post(users.signin);
    app.route('/auth/signout').get(users.signout);

    app.route('/users').get(users.hasAuthorization(['admin']), users.list)
        .post(users.hasAuthorization(['admin']), users.create)
        .put(users.hasAuthorization(['admin']), users.update);

    app.route('/users/:userId')
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), users.delete);

    app.route('/users/salt/:userName')
        .get(users.getSalt);

    // Setting up the users profile api
    app.route('/users/me').get(users.me);

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
    app.param('userName', users.userByName);
};
