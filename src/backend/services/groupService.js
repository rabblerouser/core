'use strict';

const models = require('../models'),
    logger = require('../lib/logger'),
    Group = models.Group,
    GroupMembers = models.GroupMembers;

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


function addMembers(groupId, memberIds) {
    let addMembersToGroup = memberIds.map((memberId) => {
        return {groupId: groupId, memberId: memberId};
    });

    return GroupMembers.bulkCreate(addMembersToGroup)
    .then((result) => {
        logger.info('[add-member-to-group]', result);
    })
    .catch(handleError('[add-member-to-group-failed]', 'An error has occurred while adding members to groups'));
}

module.exports = {
    list: list,
    addMembers: addMembers
};
