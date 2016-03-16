'use strict';

let memberService = require('../services/memberService');
let memberValidator = require('../lib/memberValidator');
let logger = require('../lib/logger');

function isAddressEmpty(address){
  return  !address ||
            (address.address === '' &&
            address.suburb === '' &&
            address.postcode === '');
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
      country: input.country
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
    country: input.country
  };
}

function parseMember(req) {
  return {
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      primaryPhoneNumber: req.body.primaryPhoneNumber,
      secondaryPhoneNumber: req.body.secondaryPhoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      residentialAddress: residentialAddress(req.body.residentialAddress),
      postalAddress: postalAddress(req.body.postalAddress),
      membershipType: req.body.membershipType,
      schoolType: req.body.schoolType,
      contactFirstName: req.body.contactFirstName,
      contactLastName: req.body.contactLastName,
      branch: req.body.branch,
      additionalInfo: req.body.additionalInfo,
      groups: req.body.groups
  };
}

function sendResponseToUser(res) {
  return function(createdMember) {
    let responseForUser = {
      newMember: {
        email: createdMember.email
      }
    };
    res.status(200).json(responseForUser);
  };
}

function handleError(res) {
  return function(error) {
    logger.error('[error-members-controller]', {error: error.toString()});
    res.sendStatus(500);
  };
}

let register = (req, res) => {
    let newMember = parseMember(req);

    let validationErrors = memberValidator.isValid(newMember);

    if (validationErrors.length > 0) {
        logger.info('[create-new-member-validation-error]', {errors: validationErrors});
        return res.status(400).json({ errors: validationErrors});
    }

    return memberService.createMember(newMember)
    .tap(sendResponseToUser(res))
    .catch(handleError(res));
};

function list(req, res) {
    if (!req.user) {
        logger.error('[error-members-controller]', {error: 'No session found in the request'});
        res.sendStatus(500);
        return;
    }

    return memberService.list(req.user.branchId)
    .then((members) => {
        res.status(200).json({members: members});
    })
    .catch(handleError(res));
}

function edit(req, res) {
    let member = parseMember(req);

    let validationErrors = memberValidator.isValid(member);

    if (validationErrors.length > 0 || !member.id) {
        logger.info('[edit-member-validation-error]', {errors: validationErrors});
        return res.status(400).json({ errors: validationErrors});
    }

    return memberService.edit(member)
    .then((updatedMember) => {
        res.status(200).json(updatedMember);
    })
    .catch(handleError(res));
}

module.exports = {
    register: register,
    list: list,
    edit: edit
};
