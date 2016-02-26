'use strict';

const models = require('../models'),
    logger = require('../lib/logger'),
    Branch = models.Branch;

function handleError(logMessage, userMessage) {
    return function(error) {
        logger.error(logMessage, { error: error.toString() });
        throw new Error(userMessage);
    };
}

let transformBranch = dbResult => {
    return dbResult.dataValues;
};

function transformBranches(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

let list = () => {
    let query = {
        attributes: [
            'key',
            'name'
        ]
    };

    return Branch.findAll(query)
        .then(transformBranches(transformBranch))
        .catch(handleError('[branches-list-error]', 'An error has occurred while fetching branches'));
};

function findByRefKey(refKey) {
    if (!refKey) {
        return Promise.resolve({});
    }

    var query = {where: {key: refKey}};
    return Branch.findOne(query)
    .then((result) => {
        return result ? result.dataValues : {};
    }).catch(handleError('[find-branch-by-key-error]', `Error when looking up branch with key: ${refKey}`));
}

module.exports = {
    list: list,
    findByKey: findByRefKey
};
