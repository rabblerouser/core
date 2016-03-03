'use strict';

let groupService = require('../services/groupService');
let logger = require('../lib/logger');

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

module.exports = {
    list: list,
    addMembers: addMembers
};
