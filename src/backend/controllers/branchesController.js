'use strict';

let branchService = require('../services/branchService');

function list(req, res) {
    return branchService.list()
        .then((list) => {
            res.status(200).json({branches: list});
        })
        .catch(() => {
            res.status(500);
        });
}

module.exports = {
    list: list
};
