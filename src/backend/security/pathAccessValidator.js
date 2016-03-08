'use strict';

const specificBranch = /branches\/([\d\w-]+)\//;
const logger = require('../lib/logger');

function isRequestingProtectedData(req) {
    return req.path.match(specificBranch);
}

function isUserAllowedToAccessBranch(user, path) {
    let branchIdInPath = path.match(specificBranch);
    return branchIdInPath && user ? user.branchId === branchIdInPath[1] : false;

}

function canTheDataBeAccessed(req) {
    return isRequestingProtectedData(req) && isUserAllowedToAccessBranch(req.user, req.path);
}

module.exports = function(req, res, next) {
    if (canTheDataBeAccessed(req)) {
        next();
    } else {
        logger.info('[access-denied]', `User ${req.user ? req.user.email : 'unknown'} tried to access ${req.method} ${req.path}`);
        res.sendStatus(401);
    }
};
