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
    var item = new Item(req.body);
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
};

exports.delete = function (req, res) {
    var item = req.item;
    item.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(item);
        }
    });
};

exports.byID = function (req, res, next, id) {
    Item.findById(id).exec(function (err, item) {
        if (err) return next(err);
        if (!item) return next(new Error('Failed to load Category ' + id));
        req.item = item;
        next();
    });
};
