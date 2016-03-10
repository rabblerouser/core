'use strict';

let groupService = require('../services/groupService');
let logger = require('../lib/logger');
let validator = require('../lib/inputValidator');

function list(req, res) {
    return groupService.list()
        .then((list) => {
            res.status(200).json({groups: list});
        })
        .catch(() => {
            res.sendStatus(500);
        });
}

function addMembers(req, res) {
    let groupId = req.params.groupId;
    let branchId = req.params.branchId;

    let memberIds = req.body.memberIds || [];

    if (memberIds.length === 0) {
        res.sendStatus(400);
        return null;
    }

    return groupService.addMembers(groupId, memberIds)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            logger.error(`Failed adding a member to groupId: ${groupId}, branchId: ${branchId}, members: ${memberIds.join()}`, error);
            res.sendStatus(500);
        });
}

function groupDataValid(group) {
    return validator.isValidName(group.name) && validator.isValidName(group.description);
}

function create(req, res) {
    let branchId = req.params.branchId;
    let group = {
        name: req.body.name,
        description: req.body.description
    };

    if (!groupDataValid(group)) {
        res.sendStatus(400);
        return;
    }

    return groupService.create(group, branchId)
    .then((group) => {
        res.status(200).json(group);
    })
    .catch((error) => {
        logger.error(`Failed creating a new group: branchId: ${branchId}}`, error);
        res.sendStatus(500);
    });
}

function deleteGroup(req, res) {
    let branchId = req.params.branchId;
    let groupId = req.params.groupId;

    if (!(branchId && groupId)) {
        logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}}`);
        return res.sendStatus(400);
    }

    return groupService.delete(groupId, branchId)
    .then(() => {
        res.sendStatus(200);
    })
    .catch((error) => {
        logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}}`, error);
        res.sendStatus(500);
    });
}

module.exports = {
    list: list,
    addMembers: addMembers,
    create: create,
    delete: deleteGroup
};
