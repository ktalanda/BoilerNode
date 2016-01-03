'use strict';

module.exports = function (app) {

    var core = require('../controllers/core.server.controller');

    app.route('/')
        .get(core.default);

    app.route('/ping')
        .get(core.ping);

    app.route('/mirror')
        .post(core.mirror);

    app.route('/mirror/:param')
        .get(core.mirror);

    app.param('param', core.resolveParam);
};
