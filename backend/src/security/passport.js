'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AdminUser = require('../models/index').AdminUser;
const logger = require('../lib/logger');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, AdminUser.authenticate));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => (
  AdminUser.findById(id)
    .then(dbResult => ({
      email: dbResult.email,
      branchId: dbResult.branchId,
      type: dbResult.type,
    }))
    .nodeify(done)
    .catch(err => {
      logger.error('failed to deserialize', err.toString());
      done(null, false);
    })
));
