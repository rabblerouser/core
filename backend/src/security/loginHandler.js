'use strict';

let passport = require('passport');
const adminType = require('./adminType');

module.exports = function login(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
        return res.render('error');
    }

    if (!user) {
        return res.redirect('login');
    }
    req.logIn(user, function() {
        if(req.user.type === adminType.super) {
            res.redirect('/dashboard/admin');
        }
        else {
            res.redirect('/dashboard');
        }
    });

  })(req, res);
};
