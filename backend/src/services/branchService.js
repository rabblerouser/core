'use strict';

const Q = require('q');
const models = require('../models');
const logger = require('../lib/logger');
const Branch = models.Branch;
const uuid = require('node-uuid');

function createHash() {
  return uuid.v4();
}

function handleError(logMessage, userMessage) {
  return error => {
    logger.error(logMessage, { error: error.toString() });
    throw new Error(userMessage);
  };
}

function logEvent(saveResult) {
  logger.info('[admin-user-sign-up-event]', saveResult.dataValues);
}

function save(branch) {
  return Branch.create.bind(Branch)(branch);
}

const setupNewBranch = newBranch => Object.assign({}, newBranch, { id: createHash() });

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

const transformGroup = dbResult => dbResult.dataValues;

function transformBranches(adapter) {
  return dbResult => dbResult.map(adapter);
}

function transformGroups(adapter) {
  return dbResult => dbResult.map(adapter);
}

const deleteBranch = id =>
  Branch
    .destroy({ where: { id } })
    .then(result => {
      if (!result) {
        throw new Error('No records were deleted');
      }

      logger.info('[delete-branch]', `branch with id ${id} deleted`);
    })
    .catch(handleError('[delete-branch-failed]', `An error has occurred while deleting the branch with id: ${id}`));

const create = newBranch =>
  Q
    .all(setupNewBranch(newBranch))
    .then(save)
    .tap(logEvent)
    .then(transformBranch)
    .catch(handleError('Create branch failed'));


const update = newValues =>
  Branch
    .findOne({ where: { id: newValues.id } })
    .then(branch => branch.update(newValues))
    .tap(() => logger.info('[update-branch]', `branch with id ${newValues.id} updated`))
    .then(transformBranch)
    .catch(handleError(`Error when editing branch with id ${newValues.id}`));

const list = (attrs = ['id', 'name', 'contact', 'notes']) => {
  const query = {
    attributes: attrs,
  };

  return Branch
    .findAll(query)
    .then(transformBranches(transformBranch))
    .catch(handleError('[branches-list-error]', 'An error has occurred while fetching branches'));
};

function groupsInBranch(id) {
  return Branch
    .findById(id)
    .then(result => {
      if (!result) {
        throw new Error();
      }
      return result.getGroups();
    })
    .then(transformGroups(transformGroup))
    .catch(handleError('[find-groups-in-branch-by-id-error]', `Error when looking up groups in branch with id: ${id}`));
}

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
  list,
  create,
  update,
  delete: deleteBranch,
  findById,
  groupsInBranch,
};
