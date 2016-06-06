'use strict';

const models = require('../models');
const logger = require('../lib/logger');
const Group = models.Group;
const Branch = models.Branch;
const GroupMembers = models.GroupMembers;
const uuid = require('node-uuid');

function handleError(logMessage, userMessage) {
  return error => {
    logger.error(logMessage, { error: error.toString() });
    throw new Error(userMessage);
  };
}

const transformGroup = dbResult => dbResult.dataValues;

function transformGroups(adapter) {
  return dbResult => dbResult.map(adapter);
}

const list = () => {
  const query = {
    attributes: [
      'name',
      'description',
    ],
  };

  return Group
    .findAll(query)
    .then(transformGroups(transformGroup))
    .catch(handleError('[groups-list-error]', 'An error has occurred while fetching groups'));
};

function addMembers(groupId, memberIds) {
  const addMembersToGroup = memberIds.map(memberId => ({
    groupId,
    memberId,
  }));

  return GroupMembers
    .bulkCreate(addMembersToGroup)
    .tap(() =>
      logger.info(
        '[add-member-to-group]',
        `Sucessfully added members: ${memberIds.join(',')} to group: ${groupId}`
      )
    )
    .catch(handleError('[add-member-to-group-failed]', 'An error has occurred while adding members to groups'));
}

function addGroupToBranch(branch, group) {
  return branch
    .addGroup(group)
    .then(() => group);
}

function findBranch(branchId) {
  return Branch
    .findById(branchId)
    .then(dbResult => {
      if (!dbResult) {
        throw new Error(`Branch with id: ${branchId} not found`);
      }

      return dbResult;
    });
}

function findGroup(groupId) {
  return Group
    .findById(groupId)
    .then(dbResult => {
      if (!dbResult) {
        throw new Error(`Group with id: ${groupId} not found`);
      }

      return dbResult;
    });
}

function createGroup(input) {
  return branch => {
    const group = {
      id: uuid.v4(),
      name: input.name,
      description: input.description,
    };

    return Group.create(group)
      .tap(() => logger.info('[create-group]', `group with id ${group.id} created`))
      .then(savedGroup => [branch, savedGroup]);
  };
}

function create(input, branchId) {
  return Group
    .sequelize.transaction(() =>
      findBranch(branchId)
        .then(createGroup(input))
        .spread(addGroupToBranch)
    )
    .then(transformGroup)
    .catch(handleError(
      '[create-group-failed]',
      `An error has occurred while creating group for branch with id: ${branchId}`
    ));
}

function deleteGroup(id) {
  return Group.destroy({ where: { id } })
    .then(result => {
      if (!result) {
        throw new Error('No records were deleted');
      }

      logger.info('[delete-group]', `group with id ${id} deleted`);
    })
    .catch(handleError(
      '[delete-group-failed]',
      `An error has occurred while deleting the group with id: ${id}`
    ));
}

function update(input, id) {
  return findGroup(id)
    .then(result => {
      if (!result) {
        throw new Error('Could not locate group with id');
      }

      const group = {
        id,
        name: input.name,
        description: input.description,
      };

      return result.update(group);
    })
    .then(result => {
      if (!result) {
        throw new Error('Group was not able to be updated');
      }

      logger.info('[update-group]', `group with id ${id} updated`);

      return result;
    })
    .then(transformGroup)
    .catch(handleError(
      '[update-group-failed]',
      `An error has occurred while updating a group with id: ${id}`
    ));
}

module.exports = {
  list,
  addMembers,
  create,
  delete: deleteGroup,
  update,
};
