'use strict';

const uuid = require('node-uuid');
const logger = require('../lib/logger');
const validator = require('../lib/inputValidator');
const streamClient = require('../streamClient');
const store = require('../store');

function groupDataValid(group) {
  return validator.isValidName(group.name) && validator.isValidName(group.description);
}

function createGroup(req, res) {
  const group = {
    id: uuid.v4(),
    branchId: req.params.branchId,
    name: req.body.name,
    description: req.body.description,
  };

  if (!groupDataValid(group)) {
    return res.sendStatus(400);
  }

  return streamClient.publish('group-created', group)
    .then(() => res.status(200).json(group))
    .catch(error => {
      logger.error(`Failed creating a new group: ${group}}, Error: ${error}`);
      res.sendStatus(500);
    });
}

function deleteGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  return streamClient.publish('group-removed', { id: groupId })
    .then(() => res.sendStatus(200))
    .catch(error => {
      logger.error(`Failed deleting the group with id: ${groupId} and branchId: ${branchId}}, Error: ${error}`);
      res.sendStatus(500);
    });
}

function updateGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  const group = {
    id: groupId,
    branchId,
    name: req.body.name,
    description: req.body.description,
  };

  if (!groupDataValid(group)) {
    return res.sendStatus(400);
  }

  return streamClient.publish('group-edited', group)
    .then(() => res.status(200).json(group))
    .catch(error => {
      logger.error(`Failed updating the group with id: ${groupId} and branchId: ${branchId}, Error: ${error}`);
      res.sendStatus(500);
    });
}

const getBranchGroups = (req, res) => {
  res.status(200).json({ groups: store.getGroups().filter(group => group.branchId === req.params.branchId) });
};

module.exports = {
  createGroup,
  deleteGroup,
  updateGroup,
  getBranchGroups,
};
