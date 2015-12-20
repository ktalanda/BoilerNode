'use strict';

var
    fs = require('fs'),
    https = require('https'),
    express = require('express'),
    config = require('./config'),
    path = require('path'),
    morgan = require('morgan'),
    chalk = require('chalk'),
    bodyParser = require('body-parser');

module.exports = function () {
    var app = express();

    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(
        function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Accept, Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        }
    );

    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    app.use(function(err, req, res, next) {
        if (!err) return next();
        console.error(err.stack);
        res.status(500).send({error: 'Internal server error'});
    });

    app.use(function(req, res) {
        res.status(404).send({error: 'Not Found'});
    });


    if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.black.bgWhite('Securely using https protocol'));
        var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

        return https.createServer({
            key: privateKey,
            cert: certificate
        }, app);
    }

    return app;
};