'use strict';

let memberService = require('../services/memberService');
let memberValidator = require('../../lib/memberValidator');
let messagingService = require('../services/messagingService');
let logger = require('../lib/logger');
let Q = require('q');


function isPostalAddressEmpty(postalAddress){
  return  postalAddress.address === '' &&
          postalAddress.suburb === '' &&
          postalAddress.postcode === '';
}

function residentialAddress(req) {
    return {
      address: req.body.residentialAddress.address,
      suburb: req.body.residentialAddress.suburb,
      postcode: req.body.residentialAddress.postcode,
      state: req.body.residentialAddress.state,
      country: req.body.residentialAddress.country
    };
}

function postalAddress(req) {
  if (isPostalAddressEmpty(req)) {
    return residentialAddress(req);
  }

  return {
    address: req.body.postalAddress.address,
    suburb: req.body.postalAddress.suburb,
    postcode: req.body.postalAddress.postcode,
    state: req.body.postalAddress.state,
    country: req.body.postalAddress.country
  };
}

function setupNewMember(req) {
  return {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      primaryPhoneNumber: req.body.primaryPhoneNumber,
      secondaryPhoneNumber: req.body.secondaryPhoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      residentialAddress: residentialAddress(req),
      postalAddress: postalAddress(req),
      membershipType: req.body.membershipType,
      schoolType: req.body.schoolType,
      contactFirstName: req.body.contactFirstName,
      contactLastName: req.body.contactLastName,
      branch: req.body.branch
  };
}

function sendVerificationEmailOffline(member) {
  messagingService.sendVerificationEmail(member)
  .catch((error) => logger.error('[error-sending-verification-email]', {error: error.toString()}));
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

let createNewMember = (req, res) => {
    let newMember = setupNewMember(req);

    let validationErrors = memberValidator.isValid(newMember);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors});
    }

    return memberService.createMember(newMember)
    .tap(sendResponseToUser(res))
    .tap(sendVerificationEmailOffline)
    .catch(handleError(res));
};

var updateMemberHandler = (req, res) => {

    let newMember = setupNewMember(req);

    let validationErrors = memberValidator.isValid(newMember);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors});
    }

    return memberService.updateMember(newMember)
        .then((result) => {
            res.status(200).json({ newMember: result});
        })
        .catch(handleError(res));
};

function verify(req, res) {
  let hash = req.params.hash;

  if (!memberValidator.isValidVerificationHash(hash)) {
    logger.error('[member-verification-failed]', {error: 'Invalid input params', hash: hash});
    res.sendStatus(400);
    return Q.reject('Invalid Input');
  }

  return memberService.verify(hash)
  .then(() => {
    res.redirect('/verified');
  })
  .catch(() => {
    res.sendStatus(400);
  });
}

function renew(req, res) {
    let hash = req.params.hash;

    if (!memberValidator.isValidVerificationHash(hash)) {
        logger.error('[member-verification-failed]', {hash: hash});
        res.sendStatus(400);
        return Q.reject('Invalid Input');
    }

    return memberService.findMemberByRenewalHash(hash)
        .then((result) => {
            var headers = Object.assign({}, {user: JSON.stringify(result)});
            res.header(headers).render('renew');
        });

}

function renewMemberHandler(req, res) {
    let hash = req.body.renewalHash;

    return memberService.renewMember(hash)
        .tap(sendResponseToUser(res))
        .catch(handleError(res));
}

module.exports = {
    createNewMember: createNewMember,
    updateMemberHandler: updateMemberHandler,
    verify: verify,
    renew: renew,
    renewMemberHandler: renewMemberHandler
};
