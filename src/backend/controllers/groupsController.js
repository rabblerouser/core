'use strict';

let groupService = require('../services/groupService');

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
    res.sendStatus(200);
}

module.exports = {
    list: list,
    addMembers: addMembers
};
