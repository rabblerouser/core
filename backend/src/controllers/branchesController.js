'use strict';

const uuid = require('node-uuid');
const logger = require('../lib/logger');
const adminType = require('../security/adminType');
const branchValidator = require('../lib/branchValidator');
const streamClient = require('../streamClient');
const store = require('../store');

const findBranch = id => store.getBranches().find(branch => branch.id === id);

function deleteBranch(req, res) {
  const branchId = req.params.branchId;

  if (!findBranch(branchId)) {
    return res.sendStatus(404);
  }

  const allMembers = store.getMembers();
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

  if (!findBranch(branch.id)) {
    return res.sendStatus(404);
  }

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

function listBranches(req, res) {
  const branches = store.getBranches().map(branch => ({ id: branch.id, name: branch.name }));
  res.status(200).json({ branches });
}

function branchesForAdmin(req, res) {
  let branches = store.getBranches();
  if (req.user.type === adminType.branch) {
    branches = [branches.find(branch => branch.id === req.user.branchId)];
  }

  res.status(200).json({ branches });
}

module.exports = {
  createBranch,
  updateBranch,
  deleteBranch,
  listBranches,
  branchesForAdmin,
};
