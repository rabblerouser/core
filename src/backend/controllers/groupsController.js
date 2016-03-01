'use strict';

let groupService = require('../services/groupService');

function list(req, res) {
    return groupService.list()
        .then((list) => {
            res.status(200).json({groups: list});
        })
        .catch(() => {
            res.status(500);
        });
}

module.exports = {
    list: list
};
