'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const logger = require('../lib/logger');
const store = require('../store');

const authenticate = (email, password, done) => {
  const user = store.getAdmins().find(admin => admin.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    logger.info('admin-logged-in', email);
    done(null, user);
  } else {
    logger.info('admin-failed-log-in', email);
    done(null, false);
  }
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, authenticate));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = store.getAdmins().find(admin => admin.id === id);
  if (user) {
    return done(null, user);
  }
  logger.error('failed to deserialize', id);
  return done(null, false);
});
