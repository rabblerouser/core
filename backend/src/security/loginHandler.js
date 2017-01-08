'use strict';

const passport = require('passport');

module.exports = function login(req, res) {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.render('error');
    }
    if (!user) {
      return res.redirect('login');
    }
    req.logIn(user, () => {
      res.redirect('/dashboard');
    });
    return undefined;
  })(req, res);
};
