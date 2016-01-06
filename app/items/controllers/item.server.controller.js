'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('../../base/controllers/errors.server.controller'),
    crypto = require('crypto'),
    Item = mongoose.model('Item'),
    _ = require('lodash');

exports.read = function (req, res) {
    res.jsonp(req.item);
};

exports.list = function (req, res) {
    req.query.user = req.user;
    Item.find(req.query).sort('-created').exec(function (err, items) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(items);
        }
    });
};


exports.create = function (req, res) {
    req.body.user = req.user;
    var item = new Item(req.body);
    item.user = req.user;
    item.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(item);
        }
    });
};

exports.update = function (req, res) {
    var item = req.item;
    if (item) {
        item = _.extend(item, req.body);
        item.modified = new Date().getTime();
        item.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(item);
            }
        });
    } else {
        res.status(400)
            .send('Bad request');
    }
};

exports.delete = function (req, res) {
    var item = req.item;
    if (item) {
        item.remove(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(item);
            }
        });
    } else {
        res.status(400)
            .send('Bad request');
    }
};

exports.byID = function (req, res, next, id) {
    var query = {
        _id: id,
        user: req.user
    };
    Item.where(query).findOne(function (err, item) {
        if (err) return next(err);
        req.item = item;
        next();
    });
};
