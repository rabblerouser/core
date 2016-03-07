'use strict';

const models = require('../models'),
    logger = require('../lib/logger'),
    Group = models.Group,
    Branch = models.Branch,
    GroupMembers = models.GroupMembers,
    uuid = require('node-uuid');

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
        .tap(() => {
            logger.info('[add-member-to-group]', `Sucessfully added members: ${memberIds.join(',')} to group: ${groupId}`);
        })
        .catch(handleError('[add-member-to-group-failed]', 'An error has occurred while adding members to groups'));
}

function addGroupToBranch(branch, group) {
    return branch.addGroup(group)
    .then(() => {
        return group;
    });
}

function findBranch(branchId) {
    return Branch.findOne({where: {id: branchId}});
}

function createGroup(input) {
    return function (branch) {
        let group = {id: uuid.v4(), name: input.name, description: input.description};

        return Group.create(group)
        .then((group) => {
            return [branch, group];
        });
    };
}

function create(input, branchId) {
    return findBranch(branchId)
    .then(createGroup(input))
    .spread(addGroupToBranch)
    .then(transformGroup)
    .catch(handleError('[create-group-failed]', `An error has occurred while crating group for branch with id: ${branchId}`));
}

module.exports = {
    list: list,
    addMembers: addMembers,
    create: create
};
