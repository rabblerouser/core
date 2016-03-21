'use strict';

let branchService = require('../services/branchService');
let logger = require('../lib/logger');

function list(req, res) {
    return branchService.list()
        .then((list) => {
            res.status(200).json({branches: list});
        })
        .catch(() => {
            res.sendStatus(500);
        });
}

function admins(req, res) {
    return branchService.admins(req.params.id)
        .then((list) => {
            res.status(200).json({admins: list});
        })
        .catch((error) => {
            switch (error) {
                case 'invalid branch id' :
                    res.status(400);
                    break;
                default:
                    res.status(500);
                    break;
            }
        });
}

function groupsByBranch(req, res) {
    return branchService.groupsInBranch(req.params.id)
        .then((list) => {
            res.status(200).json({groups: list});
        })
        .catch((error) => {
            switch (error) {
                case 'invalid branch id' :
                    res.status(400);
                    break;
                default:
                    res.status(500);
                    break;
            }
        });
}

function branchesForAdmin(req, res) {
    return branchService.findById(req.user.branchId)
        .then((oneForNow) => {
            res.status(200).json({branches: [oneForNow]});
        })
        .catch(() => {
            logger.error('[branches-for-admin]', `Error when retrieving branches for user: ${req.user ? req.user.email : 'unknown'}`);
            res.sendStatus(500);
        });
}

module.exports = {
    list: list,
    branchesForAdmin: branchesForAdmin,
    groupsByBranch: groupsByBranch,
    admins: admins
};
