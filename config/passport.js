const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      AdminUser = require('../src/backend/models/index').AdminUser;

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, AdminUser.authenticate));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    return AdminUser.findById(id)
    .nodeify(done)
    .catch((err) => {
        require('../lib/logger').logError(err, 'failed to deserialize');
        done(null, false);
    });
});
