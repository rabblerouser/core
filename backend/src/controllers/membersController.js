'use strict';

const isEmpty = require('lodash').isEmpty;
const uuid = require('node-uuid');
const moment = require('moment');
const memberValidator = require('../lib/memberValidator');
const csvGenerator = require('../lib/csvGenerator');
const logger = require('../lib/logger');
const streamClient = require('../streamClient');
const store = require('../store');

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

const findBranch = id => store.getBranches().find(branch => branch.id === id);

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
  if (!findBranch(newMember.branchId)) {
    validationErrors.push('Unknown branchId');
  }
  if (validationErrors.length > 0) {
    logger.info('[create-new-member-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return streamClient.publish('member-registered', newMember)
    .then(() => res.status(201).json({}))
    .catch(handleError(res));
};

const editMember = (req, res) => {
  const member = {
    id: req.params.memberId,
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: parseAddress(req.body.address),
    additionalInfo: req.body.additionalInfo,
    notes: req.body.notes,
    groups: req.body.groups,
  };

  const validationErrors = memberValidator.isValid(member);

  const branchGroups = store.getGroups().filter(group => group.branchId === req.params.branchId);
  const groupIds = branchGroups.map(group => group.id);
  (member.groups || []).forEach(group => {
    if (!groupIds.includes(group)) {
      validationErrors.push(`Unknown groupId ${group}`);
    }
  });

  if (validationErrors.length > 0 || !member.id) {
    logger.info('[edit-member-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return streamClient.publish('member-edited', member)
    .then(() => res.status(201).json({}))
    .catch(handleError(res));
};

const getBranchMembers = branchId => store.getMembers().filter(member => member.branchId === branchId);

const listBranchMembers = (req, res) => {
  res.status(200).json({ members: getBranchMembers(req.params.branchId) });
};

const exportBranchMembers = (req, res) => {
  res.set({
    'Content-Type': 'application/csv',
    'Content-Disposition': 'attachment; filename="members.csv"',
  });
  const exportFields = ['id', 'name', 'phoneNumber', 'email', 'memberSince', 'branchId'];
  const members = getBranchMembers(req.params.branchId);
  return res.send(csvGenerator.generateCsv(exportFields, members));
};

const deleteMember = (req, res) => {
  const memberId = req.params.memberId;

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
