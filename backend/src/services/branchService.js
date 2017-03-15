'use strict';

const Branch = require('../models').Branch;
const logger = require('../lib/logger');

function handleError(logMessage, userMessage) {
  return error => {
    logger.error(logMessage, { error: error.toString() });
    throw new Error(userMessage);
  };
}

const transformBranch = dbResult => {
  if (dbResult.dataValues) {
    return {
      id: dbResult.dataValues.id,
      name: dbResult.dataValues.name,
      notes: dbResult.dataValues.notes,
      contact: dbResult.dataValues.contact,
    };
  }
  return undefined;
};

function findById(id) {
  if (!id) {
    return Promise.resolve({});
  }

  return Branch
    .findById(id)
    .then(result => (result ? transformBranch(result) : {}))
    .catch(handleError('[find-branch-by-id-error]', `Error when looking up branch with id: ${id}`));
}

module.exports = {
  findById,
};
