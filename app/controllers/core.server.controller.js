'use strict';

exports.get = function (req, res) {
    return res.send({
        message: 'dasdasdadsd'
    });
};

exports.post = function (req, res) {
    var input = req.body.input;
    return res.send({message: input});
};

exports.getWithParam = function (req, res) {
    return res.send({param: req.param});
};

exports.resolveParam = function (req, res, next, param) {
    req.param = param;
    next();
};
