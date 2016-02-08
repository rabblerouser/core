const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      AdminUser = require('../models/index').AdminUser;

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, AdminUser.authenticate));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    var logger = require('../lib/logger');
    logger.logInfoEvent('ID ABOUT TO BE DESERIALIZED',id);
    return AdminUser.findById(id).then((err, value) => {
        logger.logInfoEvent('VALUE OF FIND IN DESERIALIZED',value);
        logger.logInfoEvent('ERROR OF FIND IN DESERIALIZED',value);
        done(value, err);
    });
});
