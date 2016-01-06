'use strict';

var
    express = require('express'),
    config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    https = require('https'),
    passport = require('passport'),
    chalk = require('chalk'),
    flash = require('connect-flash'),
    helmet = require('helmet'),

    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');

module.exports = function (db) {
    var app = express();

    config.getGlobbedFiles('./app/**/models/**/*.js').forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });

    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

    //Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    app.use(
        function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Accept, Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        }
    );

    config.getGlobbedFiles('./app/**/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    app.use(function (err, req, res, next) {
        if (!err) return next();
        console.error(err.stack);
        res.status(500).send({error: 'Internal server error'});
    });

    app.use(function (req, res) {
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
