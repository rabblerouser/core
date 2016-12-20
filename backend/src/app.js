'use strict';

require('../config/passport');
const errorLogger = require('./lib/logger');

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressSanitized = require('express-sanitized');
const helmet = require('helmet');
const routes = require('./routes/index');
const session = require('express-session');
const passport = require('passport');
const app = express();
const SequelizeSessionStore = require('connect-session-sequelize')(session.Store);
const db = require('./db/connection');
const compress = require('compression');
const sessionStore = new SequelizeSessionStore({ db });
const config = require('./config');

sessionStore.sync();
app.use(compress());
app.set('views', path.join(__dirname, '../public/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon(path.join(__dirname, '../public', 'images', config.skin, 'favicon.ico'), { maxAge: 100 }));
app.use(helmet());
if (process.env.NODE_ENV !== 'test') {
  app.use(logger(config.logFormat));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitized());
app.use(session({
  secret: config.session.secret,
  store: sessionStore,
  proxy: config.session.proxy,
  resave: false,
  saveUninitialized: false,
  cookie: { domain: config.session.domain, secure: config.session.secureCookie },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  errorLogger.error('[general-application-error]', { error: error.stack });
  res.status(error.status || 500);
  res.render('error');
  next(error);
});

module.exports = app;
