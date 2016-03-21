'use strict';

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      AdminUser = require('../src/backend/models/index').AdminUser;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, AdminUser.authenticate));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    return AdminUser.findById(id)
    .then((dbResult) => {
        return {
            email: dbResult.email,
            branchId: dbResult.branchId,
            type: dbResult.type
        };
    })
    .nodeify(done)
    .catch((err) => {
        require('../src/backend/lib/logger').error('failed to deserialize', err.toString());
        done(null, false);
    });
});
