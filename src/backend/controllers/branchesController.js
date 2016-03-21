'use strict';

let branchService = require('../services/branchService');
let adminService = require('../services/adminService');
let logger = require('../lib/logger');
let adminType = require('../security/adminType');
let validator = require('../lib/inputValidator');

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
    return adminService.admins(req.params.branchId)
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

function parseAdmin(req) {
    let admin = {id: req.body.id};
    if (req.body.name !== undefined ) { admin.name = req.body.name; }
    if (req.body.email !== undefined) { admin.email = req.body.email; }
    if (req.body.phoneNumber !== undefined) { admin.phoneNumber = req.body.phoneNumber; }
    if (req.body.password !== undefined) { admin.password = req.body.password; }
    return admin;
}

function adminDataValid(admin) {
    return validator.isValidOptionalName(admin.name)  &&
           validator.isValidEmail(admin.email) &&
           validator.isValidPhone(admin.phoneNumber);
}

function updateAdmin(req, res) {
    let admin = parseAdmin(req);

    if (!adminDataValid(admin) || !admin.id) {
        logger.info('[update-admin-validation-error]');
        return res.status(400).json();
    }

    return adminService.updateAdmin(admin)
    .then((updatedAdmin) => {
        res.status(200).json(updatedAdmin);
    })
    .catch((error) => {
        logger.error(`Failed updating the admin with id:${admin.id}`, error);
        res.sendStatus(500);
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

function findBranches(admin) {
    if (admin.type === adminType.super) {
        return branchService.list();
    }

    return branchService.findById(admin.branchId)
    .then((result) => {
        delete result.notes;
        return [result];
    });
}

function branchesForAdmin(req, res) {
    return findBranches(req.user)
        .then((result) => {

            res.status(200).json({branches: result});
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
    admins: admins,
    updateAdmin: updateAdmin
};
