'use strict';

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
      neat = require('node-neat'),
      app = express();

const env = process.env.NODE_ENV || 'development';

const SequelizeSessionStore = require('connect-session-sequelize')(session.Store);
const db = require('./db/connection');
const sessionStore = new SequelizeSessionStore({db: db});
const sessionOpts = require('./config/configManager').session;

const logFormat = () => {
    if (['developement', 'test'].indexOf(env) > -1) {
        return 'dev';
    }
    else {
        return '[:date[iso]] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
    }
};


let initialiseApp = () => {
    sessionStore.sync();
}();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(helmet());
app.use(logger(logFormat()));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitized());
app.use(session({
    secret: sessionOpts.secret,
    store: sessionStore,
    proxy: sessionOpts.proxy,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: sessionOpts.secureCookie }
}));
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    includePaths: neat.includePaths
}), express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
