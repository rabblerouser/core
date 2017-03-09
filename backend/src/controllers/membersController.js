'use strict';

const isEmpty = require('lodash').isEmpty;
const uuid = require('node-uuid');
const moment = require('moment');
const branchService = require('../services/branchService');
const memberValidator = require('../lib/memberValidator');
const inputValidator = require('../lib/inputValidator');
const csvGenerator = require('../lib/csvGenerator');
const logger = require('../lib/logger');
const streamClient = require('../streamClient');
const store = require('../store');
const reducers = require('../reducers/rootReducer');

function isAddressEmpty(address) {
  return !address ||
            (isEmpty(address.address) &&
            isEmpty(address.suburb) &&
            isEmpty(address.postcode));
}

function parseAddress(input) {
  if (isAddressEmpty(input)) {
    return null;
  }

  return {
    address: input.address,
    suburb: input.suburb,
    postcode: input.postcode,
    state: input.state,
    country: input.country,
  };
}

function handleError(res) {
  return error => {
    logger.error('[error-members-controller]', { error: error.toString() });
    res.sendStatus(500);
  };
}

const registerMember = (req, res) => {
  const newMember = {
    id: uuid.v4(),
    memberSince: moment(),
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: parseAddress(req.body.address),
    additionalInfo: req.body.additionalInfo,
    branchId: req.body.branchId,
  };
  const validationErrors = memberValidator.isValid(newMember);

  return branchService.findById(newMember.branchId)
    .then(branch => {
      if (!branch.id) {
        validationErrors.push('Unknown branchId');
      }
    })
    .then(() => {
      if (validationErrors.length > 0) {
        logger.info('[create-new-member-validation-error]', { errors: validationErrors });
        return res.status(400).json({ errors: validationErrors });
      }

      return streamClient.publish('member-registered', newMember)
        .then(() => res.status(201).json({}))
        .catch(handleError(res));
    });
};

const editMember = (req, res) => {
  const member = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: parseAddress(req.body.address),
    additionalInfo: req.body.additionalInfo,
    notes: req.body.notes,
    groups: req.body.groups,
    branchId: req.body.branchId,
  };

  const validationErrors = memberValidator.isValid(member);

  const branchGroups = reducers.getGroups(store.getState()).filter(group => group.branchId === member.branchId);
  const groupIds = branchGroups.map(group => group.id);
  (member.groups || []).forEach(group => {
    if (!groupIds.includes(group)) {
      validationErrors.push(`Unknown groupId ${group}`);
    }
  });

  return branchService.findById(member.branchId)
    .then(branch => {
      if (!branch.id) {
        validationErrors.push('Unknown branchId');
      }
    })
    .then(() => {
      if (validationErrors.length > 0 || !member.id) {
        logger.info('[edit-member-validation-error]', { errors: validationErrors });
        return res.status(400).json({ errors: validationErrors });
      }

      return streamClient.publish('member-edited', member)
        .then(() => res.status(201).json({}))
        .catch(handleError(res));
    });
};

const getBranchMembers = branchId => {
  if (!branchId) {
    return [];
  }
  return reducers.getMembers(store.getState()).filter(member => member.branchId === branchId);
};

const listBranchMembers = (req, res) => {
  const members = getBranchMembers(req.params.branchId);
  res.status(200).json({ members });
};

const exportBranchMembers = (req, res) => {
  const members = getBranchMembers(req.params.branchId);
  res.set({
    'Content-Type': 'application/csv',
    'Content-Disposition': 'attachment; filename="members.csv"',
  });
  const exportFields = ['id', 'name', 'phoneNumber', 'email', 'memberSince', 'branchId'];
  res.send(csvGenerator.generateCsv(exportFields, members));
};

const deleteMember = (req, res) => {
  const memberId = req.params.memberId;

  if (!(inputValidator.isValidUUID(memberId))) {
    logger.error(`Failed deleting the member with memberId: ${memberId}`);
    return res.sendStatus(400);
  }

  return streamClient.publish('member-removed', { id: memberId })
    .then(() => res.sendStatus(200))
    .catch(handleError(res));
};

module.exports = {
  registerMember,
  listBranchMembers,
  exportBranchMembers,
  editMember,
  deleteMember,
};
