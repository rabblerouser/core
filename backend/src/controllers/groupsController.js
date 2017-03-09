'use strict';

const uuid = require('node-uuid');
const groupService = require('../services/groupService');
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
    name: req.body.name,
    description: req.body.description,
    branchId: req.params.branchId,
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

  return groupService.delete(groupId)
    .then(() => (
      streamClient.publish('group-removed', { id: groupId })
    ))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      logger.error(`Failed deleting the group with id:${groupId} and branchId: ${branchId}}`, error);
      res.sendStatus(500);
    });
}

function updateGroup(req, res) {
  const branchId = req.params.branchId;
  const groupId = req.params.groupId;

  if (!(validator.isValidUUID(branchId) && validator.isValidUUID(groupId))) {
    logger.error(`Failed updating the group with id:${groupId} and branchId: ${branchId}`);
    return res.sendStatus(400);
  }

  const group = {
    name: req.body.name,
    description: req.body.description,
  };

  if (!groupDataValid(group)) {
    res.sendStatus(400);
    return undefined;
  }

  return groupService.update(group, groupId)
    .then(groupData => res.status(200).json(groupData))
    .catch(error => {
      logger.error(`Failed updating the group with id:${groupId} and branchId: ${branchId}`, error);
      res.sendStatus(500);
    });
}

module.exports = {
  createGroup,
  deleteGroup,
  updateGroup,
};
