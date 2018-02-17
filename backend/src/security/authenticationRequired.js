'use strict';

const logger = require('../lib/logger');

module.exports = function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    logger.info(`Unauthenticated access attempted to protected route: ${req.url}`);
    req.session.messages = 'You need to login to view this page';
    res.redirect('/login');
    return;
  }
  next();
};
