'use strict';

module.exports = function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        require('../lib/logger').info('Attempted unauth access', req.url);
        req.session.messages = 'You need to login to view this page';
        res.redirect('/login');
        return;
    }
    next();
};