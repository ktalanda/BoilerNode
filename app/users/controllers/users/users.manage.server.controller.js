'use strict';

var _ = require('lodash'),
    errorHandler = require('../../../base/controllers/errors.server.controller.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    crypto = require('crypto'),
    User = mongoose.model('User');

exports.create = function (req, res) {
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};

exports.update = function (req, res) {
    var user = req.user;
    user = _.extend(user, req.body);
    user.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};

exports.delete = function (req, res) {
    var user = req.profile;
    user.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: user
            });
        } else {
            res.jsonp(user);
        }
    });
};

exports.list = function (req, res) {
    User.find().sort('-created').exec(function (err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};

exports.userByName = function (req, res, next, name) {
    User.findOne({
        username: name
    }).exec(function (err, user) {
        if (err) return next(err);
        if (!user) return next();
        req.profile = user;
        next();
    });
};

exports.getSalt = function (req, res) {
    var user = req.profile;
    if (user) {
        res.jsonp(user.salt);
    } else {
        return res.status(400).send({
            message: 'Data Incorrect'
        });
    }
};
