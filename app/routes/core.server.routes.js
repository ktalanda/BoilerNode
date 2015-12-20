'use strict';

module.exports = function (app) {

    var core = require('../controllers/core.server.controller');

    app.route('/')
        .get(core.get)
        .post(core.post);

    app.route('/:param')
        .get(core.getWithParam);

    app.param('param', core.resolveParam);
};