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
    return AdminUser.findById(id).then((err, value) => {done(value, err);});
});
