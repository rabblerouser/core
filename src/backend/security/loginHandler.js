'use strict';

let passport = require('passport');
const adminType = require('./adminType');

module.exports = function login(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
        return res.render('error');
    }

    if (!user) {
        return res.render('login', {error: 'Wrong username or password'});
    }
    req.logIn(user, function(err) {
        if (err) {
            next(err);
        }

        console.log('=======', req.cookies['connect.sid']);
        if(req.user.type === adminType.super) {
            res.redirect('/dashboard/admin');
        }
        else {
            res.redirect('/dashboard');
        }
    });

  })(req, res, next);
};
