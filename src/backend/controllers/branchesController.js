'use strict';

let branchService = require('../services/branchService');

function list(req, res) {
    return branchService.list()
        .then((list) => {
            res.status(200).json({branches: list});
        })
        .catch(() => {
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

module.exports = {
    list: list,
    groupsByBranch: groupsByBranch
};
