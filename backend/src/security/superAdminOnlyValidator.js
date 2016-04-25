'use strict';

const logger = require('../lib/logger');
const adminType = require('./adminType');

function isSuperAdmin(req) {
    if (req.user && req.user.type === adminType.super) {
        return true;
    }
    return false;
}

module.exports = function(req, res, next) {
    if (isSuperAdmin(req)) {
        next();
    } else {
        logger.info('[access-denied]', `User ${req.user ? req.user.email : 'unknown'} tried to access ${req.method} ${req.path}`);
        res.sendStatus(401);
    }
};
