'use strict';

const logger = require('../lib/logger');
const models = require('../models');

const Group = models.Group;

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
      'id',
      'name',
      'description',
    ],
  };

  return Group
    .findAll(query)
    .then(transformGroups(transformGroup))
    .catch(handleError('[groups-list-error]', 'An error has occurred while fetching groups'));
};

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
  update,
};
