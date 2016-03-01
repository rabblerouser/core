'use strict';

const models = require('../models'),
    logger = require('../lib/logger'),
    Group = models.Group;

function handleError(logMessage, userMessage) {
    return function(error) {
        logger.error(logMessage, { error: error.toString() });
        throw new Error(userMessage);
    };
}

let transformGroup = dbResult => {
    return dbResult.dataValues;
};

function transformGroups(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

let list = () => {
    let query = {
        attributes: [
            'name',
            'description'
        ]
    };

    return Group.findAll(query)
        .then(transformGroups(transformGroup))
        .catch(handleError('[groups-list-error]', 'An error has occurred while fetching groups'));
};

module.exports = {
    list: list
};
