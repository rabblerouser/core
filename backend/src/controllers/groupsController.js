'use strict';

const uuid = require('node-uuid');
const branchService = require('../services/branchService');
const logger = require('../lib/logger');
const validator = require('../lib/inputValidator');
const streamClient = require('../streamClient');

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

  return branchService.findById(group.branchId)
    .then(branch => {
      if (!branch.id) {
        res.sendStatus(400);
        throw new Error();
      }
    })
    .then(() => streamClient.publish('group-created', group))
    .then(
      () => res.status(200).json(group),
      error => {
        logger.error(`Failed creating a new group: ${group}}: `, error);
        res.sendStatus(500);
      }
    )
    .catch(() => {});
}

function deleteGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  if (!(validator.isValidUUID(branchId) && validator.isValidUUID(groupId))) {
    logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}`);
    return res.sendStatus(400);
  }

  return branchService.findById(branchId)
    .then(branch => {
      if (!branch.id) {
        res.sendStatus(404);
        throw new Error();
      }
    })
    .then(() => streamClient.publish('group-removed', { id: groupId }))
    .then(
      () => res.sendStatus(200),
      error => {
        logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}}`, error);
        res.sendStatus(500);
      }
    )
    .catch(() => {});
}

function updateGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  if (!(validator.isValidUUID(branchId) && validator.isValidUUID(groupId))) {
    logger.error(`Failed updating the group with id:${groupId} and branchId: ${branchId}`);
    return res.sendStatus(400);
  }

  const group = {
    id: groupId,
    branchId,
    name: req.body.name,
    description: req.body.description,
  };

  if (!groupDataValid(group)) {
    return res.sendStatus(400);
  }

  return branchService.findById(branchId)
    .then(branch => {
      if (!branch.id) {
        res.sendStatus(404);
        throw new Error();
      }
    })
    .then(() => streamClient.publish('group-edited', group))
    .then(
      () => res.status(200).json(group),
      error => {
        logger.error(`Failed updating the group with id:${groupId} and branchId: ${branchId}`, error);
        res.sendStatus(500);
      }
    )
    .catch(() => {});
}

module.exports = {
  createGroup,
  deleteGroup,
  updateGroup,
};
