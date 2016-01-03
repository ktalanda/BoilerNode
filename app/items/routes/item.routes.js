'use strict';

module.exports = function (app) {

    var users = require('../../users/controllers/users.server.controller'),
        itemController = require('../controllers/item.server.controller');

    app.route('/item')
        .get(users.requiresLogin, itemController.list)
        .post(users.requiresLogin, itemController.create);

    app.route('/item/:itemId')
        .get(itemController.read)
        .put(itemController.update)
        .delete(itemController.delete);

    app.param('itemId', itemController.byID);
};
