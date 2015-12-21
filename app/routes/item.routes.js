'use strict';

module.exports = function (app) {

    var itemController = require('../../app/controllers/item.server.controller');

    app.route('/item')
        .get(itemController.list)
        .post(itemController.create);

    app.route('/item/:itemId')
        .get(itemController.read)
        .put(itemController.update)
        .delete(itemController.delete);

    app.param('itemId', itemController.byID);
};