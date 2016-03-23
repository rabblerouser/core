'use strict';

let passport = require('passport');
const adminType = require('./adminType');

module.exports = function login(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
        return res.render('error');
    }

    if (!user) {
        return res.render('login', {error: 'Wrong username or password'});
    }
    req.logIn(user, function() {
        if(req.user.type === adminType.super) {
            res.redirect('/networkadmin');
        }
        else {
            res.redirect('/admin');
        }
    });

  })(req, res);
};
