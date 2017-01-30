'use strict';

const isEmpty = require('lodash').isEmpty;
const memberService = require('../services/memberService');
const messagingService = require('../services/messagingService');
const memberValidator = require('../lib/memberValidator');
const inputValidator = require('../lib/inputValidator');
const csvGenerator = require('../lib/csvGenerator');
const logger = require('../lib/logger');

function isAddressEmpty(address) {
  return !address ||
            (isEmpty(address.address) &&
            isEmpty(address.suburb) &&
            isEmpty(address.postcode));
}

function residentialAddress(input) {
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

function postalAddress(input) {
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

function blankToNull(input) {
  return isEmpty(input) ? null : input;
}

function parseMember(req) {
  return {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: blankToNull(req.body.lastName),
    email: req.body.email,
    gender: req.body.gender,
    primaryPhoneNumber: req.body.primaryPhoneNumber,
    secondaryPhoneNumber: req.body.secondaryPhoneNumber,
    residentialAddress: residentialAddress(req.body.residentialAddress),
    postalAddress: postalAddress(req.body.postalAddress),
    membershipType: req.body.membershipType,
    branchId: req.body.branchId,
    additionalInfo: req.body.additionalInfo,
    notes: req.body.notes,
    groups: req.body.groups,
  };
}

function sendResponseToUser(res) {
  return createdMember => {
    const responseForUser = {
      newMember: {
        email: createdMember.email,
      },
    };
    res.status(200).json(responseForUser);
  };
}

function handleError(res) {
  return error => {
    logger.error('[error-members-controller]', { error: error.toString() });
    res.sendStatus(500);
  };
}

const register = (req, res) => {
  const newMember = parseMember(req);
  const validationErrors = memberValidator.isValid(newMember);

  if (validationErrors.length > 0) {
    logger.info('[create-new-member-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return memberService
    .createMember(newMember)
    .tap(sendResponseToUser(res))
    .tap(messagingService.sendWelcomeEmail)
    .catch(handleError(res));
};

function list(req, res) {
  if (!req.user) {
    logger.error('[error-members-controller]', { error: 'No session found in the request' });
    res.sendStatus(500);
    return undefined;
  }

  return memberService
    .list(req.params.branchId)
    .then(members => res.status(200).json({ members }))
    .catch(handleError(res));
}

function exportBranchMembers(req, res) {
  return memberService.list(req.params.branchId)
    .then(members => {
      res.set({
        'Content-Type': 'application/csv',
        'Content-Disposition': 'attachment; filename="members.csv"',
      });
      const exportFields = [
        'id',
        'firstName',
        'lastName',
        'primaryPhoneNumber',
        'secondaryPhoneNumber',
        'email',
        'membershipType',
        'memberSince',
        'branchId',
      ];
      res.send(csvGenerator.generateCsv(exportFields, members));
    });
}

function edit(req, res) {
  const member = parseMember(req);

  const validationErrors = memberValidator.isValid(member);

  if (validationErrors.length > 0 || !member.id) {
    logger.info('[edit-member-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return memberService
    .edit(member)
    .then(updatedMember => res.status(200).json(updatedMember))
    .catch(handleError(res));
}

function deleteMember(req, res) {
  const memberId = req.params.memberId;

  if (!(inputValidator.isValidUUID(memberId))) {
    logger.error(`Failed deleting the member with memberId: ${memberId}`);
    return res.sendStatus(400);
  }

  return memberService.delete(memberId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      logger.error(`Failed deleting the member with memberId: ${memberId}}`, error);
      res.sendStatus(500);
    });
}


module.exports = {
  register,
  list,
  exportBranchMembers,
  edit,
  delete: deleteMember,
};
