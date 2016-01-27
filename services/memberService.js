'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    Address = models.Address,
    Member = models.Member;

function save(member) {
  return Member.create.bind(Member)(member);
}

function setupMember(newMember) {
  return function (residentialAddress, postalAddress) {
    return {
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        email: newMember.email,
        gender: newMember.gender,
        dateOfBirth: moment(newMember.dateOfBirth, 'DD/MM/YYYY').toDate(),
        primaryPhoneNumber: newMember.primaryPhoneNumber,
        secondaryPhoneNumber: newMember.secondaryPhoneNumber,
        residentialAddressId: residentialAddress[0].dataValues.id,
        postalAddressId: postalAddress[0].dataValues.id,
        membershipType: newMember.membershipType,
        verified: false
    };
  };
}

function logEvent(saveResult) {
  logger.logMemberSignUpEvent(saveResult.dataValues);
}

function getMemberAddresses(newMember) {
  return [
    Q(Address.findOrCreate({where: newMember.residentialAddress, defaults: newMember.residentialAddress})),
    Q(Address.findOrCreate({where: newMember.postalAddress, defaults: newMember.postalAddress}))
  ];
}

let createMember = (newMember) => {
    return Q.all(getMemberAddresses(newMember))
          .spread(setupMember(newMember))
          .then(save)
          .tap(logEvent);
};

module.exports = {
    createMember: createMember
};
