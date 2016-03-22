'use strict';

let branchService = require('../services/branchService');
let logger = require('../lib/logger');
let adminType = require('../security/adminType');
let branchValidator = require('../lib/branchValidator');

function list(req, res) {
    return branchService.list()
        .then((list) => {
            res.status(200).json({branches: list});
        })
        .catch(() => {
            res.sendStatus(500);
        });
}

function parseBranch(req) {
    let branch = {id: req.body.id};
    if (req.body.name !== undefined ) { branch.name = req.body.name; }
    if (req.body.notes !== undefined) { branch.email = req.body.email; }
    if (req.body.contact !== undefined) { branch.phoneNumber = req.body.phoneNumber; }
    return branch;
}

function create(req, res) {

    let newBranch = parseBranch(req);
    let validationErrors = branchValidator.isValid(newBranch);

    if (validationErrors.length > 0) {
        logger.info('[create-new-branch-validation-error]', {errors: validationErrors});
        return res.status(400).json({ errors: validationErrors});
    }

    return branchService.create(newBranch)
    .then((newBranch) => {
        res.status(200).json(newBranch);
    })
    .catch((error) => {
        logger.error(`Failed creating a new branch`, error);
        return res.status(500);
    });
}

function update(req, res) {
    let branch = parseBranch(req);

    if (!branch.id || branch.id !== req.params.branchId) {
        logger.info('[update-branch-validation-error]', {errors: ['invalid params']});
        return res.status(400).json({ errors: ['invalid params']});
    }

    let validationErrors = branchValidator.isValid(branch);
    if (validationErrors.length > 0) {
        logger.info('[update-branch-validation-error]', {errors: validationErrors});
        return res.status(400).json({ errors: validationErrors});
    }

    return branchService.update(branch)
    .then((updatedBranch) => {
        res.status(200).json(updatedBranch);
    })
    .catch((error) => {
        logger.error(`Failed updating the branch id:${branch.id}`, error);
        res.status(500);
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
    create: create,
    update: update,
    branchesForAdmin: branchesForAdmin,
    groupsByBranch: groupsByBranch
};
