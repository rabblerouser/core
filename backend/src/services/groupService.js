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

module.exports = {
  list,
};
