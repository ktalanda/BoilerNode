'use strict';

exports.default = function (req, res) {
    return res.send('WORKING (ping, mirror)');
};

exports.ping = function (req, res) {
    return res.send('SUCCESS');
};

exports.mirror = function (req, res) {
    var output = req.body.input || req.param;
    return res.send({
        output: output
    });
};

exports.resolveParam = function (req, res, next, param) {
    req.param = param;
    next();
};
