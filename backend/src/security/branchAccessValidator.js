'use strict';

const specificBranch = /branches\/([\d\w-]+)\//;
const logger = require('../lib/logger');
const adminType = require('./adminType');

function isRequestingProtectedData(req) {
  return req.path.match(specificBranch);
}

function isUserAllowedToAccessBranch(user, path) {
  if (user.type === adminType.super) {
    return true;
  }

  const branchIdInPath = path.match(specificBranch);
  return branchIdInPath && user ? user.branchId === branchIdInPath[1] : false;
}

function canTheDataBeAccessed(req) {
  return isRequestingProtectedData(req) && isUserAllowedToAccessBranch(req.user, req.path);
}

module.exports = (req, res, next) => {
  if (canTheDataBeAccessed(req)) {
    next();
  } else {
    logger.info(`User ${req.user ? req.user.email : 'unknown'} tried to access ${req.method} ${req.path}`);
    res.sendStatus(401);
  }
};
