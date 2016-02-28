'use strict';

require('../../config/passport');

const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      expressSanitized = require('express-sanitized'),
      helmet = require('helmet'),
      routes = require('./routes/index'),
      sassMiddleware = require('node-sass-middleware'),
      session = require('express-session'),
      passport = require('passport'),
      neat = require('node-neat'),
      app = express(),
      config = require('config'),
      SequelizeSessionStore = require('connect-session-sequelize')(session.Store),
      db = require('./db/connection'),
      sessionStore = new SequelizeSessionStore({db: db}),
      membershipRenewalJob = require('./services/membershipRenewalService');

sessionStore.sync();

app.set('views', path.join(__dirname, '../frontend/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, '../../public', 'images', 'favicon.ico')));
app.use(helmet());
app.use(logger(config.logFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitized());
app.use(session({
    secret: config.session.secret,
    store: sessionStore,
    proxy: config.session.proxy,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.session.secureCookie }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(sassMiddleware({
    src: path.join(__dirname, '../../public'),
    dest: path.join(__dirname, '../../public'),
    debug: true,
    outputStyle: 'compressed',
    includePaths: neat.includePaths
}), express.static(path.join(__dirname, '../../public')));

app.use('/', routes);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    require('./lib/logger').error('[general-application-error]', {error: error.stack});
    res.status(error.status || 500);
    res.render('error');

    next(error);
});

membershipRenewalJob.start();

module.exports = app;
