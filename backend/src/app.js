'use strict';

require('./security/passport');
const logger = require('./lib/logger');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressSanitized = require('express-sanitized');
const helmet = require('helmet');
const routes = require('./routes/index');
const session = require('express-session');
const passport = require('passport');
const ejs = require('ejs');
const MemoryStore = require('session-memory-store')(session);
const compress = require('compression');
const config = require('./config');

const app = express();

app.use(compress());
app.set('views', path.join(__dirname, '../public/views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(favicon(path.join(__dirname, '../public', 'images', 'favicon.ico'), { maxAge: 100 }));
app.use(helmet());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitized());
app.use(session({
  secret: config.session.secret,
  store: new MemoryStore(),
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
  logger.error(`Unhandled error: ${error.stack}`);
  res.status(error.status || 500);
  res.render('error');
  next(error);
});

module.exports = app;
