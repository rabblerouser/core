'use strict';

const passport = require('passport');
const adminType = require('./adminType');

module.exports = function login(req, res) {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.render('error');
    }
    if (!user) {
      return res.redirect('login');
    }
    req.logIn(user, () => {
      if (req.user.type === adminType.super) {
        res.redirect('/dashboard/admin');
      } else {
        res.redirect('/dashboard');
      }
    });
  })(req, res);
};
