'use strict';

const uuid = require('node-uuid');
const branchService = require('../services/branchService');
const logger = require('../lib/logger');
const adminType = require('../security/adminType');
const branchValidator = require('../lib/branchValidator');
const streamClient = require('../streamClient');
const store = require('../store');
const reducers = require('../reducers/rootReducer');

function listBranches(req, res) {
  return branchService.list(['id', 'name'])
    .then(branches => res.status(200).json({ branches }))
    .catch(() => res.sendStatus(500));
}

function deleteBranch(req, res) {
  const branchId = req.params.branchId;

  const allMembers = reducers.getMembers(store.getState());
  if (allMembers.find(member => member.branchId === branchId)) {
    logger.error(`Refusing to delete branch which still has members: ${branchId}}`);
    return res.sendStatus(400);
  }

  return streamClient.publish('branch-removed', { id: branchId })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      logger.error(`Failed deleting the admin with branchId: ${branchId}}`, error);
      res.sendStatus(500);
    });
}

function createBranch(req, res) {
  const branch = {
    id: uuid.v4(),
    name: req.body.name,
    notes: req.body.notes,
    contact: req.body.contact,
  };
  const validationErrors = branchValidator.isValid(branch);

  if (validationErrors.length > 0) {
    logger.info('[create-new-branch-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return streamClient.publish('branch-created', branch)
    .then(() => res.status(200).json(branch))
    .catch(error => {
      logger.error('Failed creating a new branch', error);
      return res.sendStatus(500);
    });
}

function updateBranch(req, res) {
  const branch = {
    id: req.params.branchId,
    name: req.body.name,
    notes: req.body.notes,
    contact: req.body.contact,
  };

  const validationErrors = branchValidator.isValid(branch);
  if (validationErrors.length > 0) {
    logger.info('[update-branch-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return streamClient.publish('branch-edited', branch)
    .then(() => res.status(200).json(branch))
    .catch(error => {
      logger.error(`Failed updating the branch id:${branch.id}`, error);
      res.sendStatus(500);
    });
}

function findBranches(admin) {
  if (admin.type === adminType.super) {
    return branchService.list();
  }

  return branchService.findById(admin.branchId)
    .then(result => {
      delete result.notes;
      return [result];
    });
}

function branchesForAdmin(req, res) {
  return findBranches(req.user)
    .then(result => res.status(200).json({ branches: result }))
    .catch(() => {
      logger.error('[branches-for-admin]', `Error when retrieving branches for user: ${req.user ? req.user.email : 'unknown'}`);
      res.sendStatus(500);
    });
}

module.exports = {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  branchesForAdmin,
};
