'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    Address = models.Address,
    Member = models.Member,
    crypto = require('crypto');

function createVerificationHash() {
  let randomSeed = Math.random(1, 5000).toString();
  return crypto.createHash('sha256').update(randomSeed).digest('hex');
}

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
        verified: false,
        verificationHash: createVerificationHash()
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
          .tap(logEvent)
          .then((savedMember) => {
            return  savedMember.dataValues;
          });
};

var updateMember = (member) => {

    return Q.all([
        Q(Member.find({where: {email: member.email}})),
        Q(Address.findOrCreate({where: member.residentialAddress, defaults: member.residentialAddress})),
        Q(Address.findOrCreate({where: member.postalAddress, defaults: member.postalAddress}))
    ])
        .spread((user, residentialAddress, postalAddress) => {
            if(!user){
                return Q.reject('Error: User email does not exist');
            }
            return {
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
                gender: member.gender,
                dateOfBirth: moment(member.dateOfBirth, 'DD/MM/YYYY').toDate(),
                primaryPhoneNumber: member.primaryPhoneNumber,
                secondaryPhoneNumber: member.secondaryPhoneNumber,
                residentialAddress: residentialAddress[0].dataValues.id,
                postalAddress: postalAddress[0].dataValues.id,
                membershipType: member.membershipType
            };
        })
        .then(function(updatedMember){
            return Member.update(updatedMember, {where: {email: member.email}})
        })
        .tap(function(a){
            logger.logMemberSignUpEvent(a);
        })
        .catch((error) => {
            return Q.reject(error);
        });
};

module.exports = {
    createMember: createMember,
    updateMember: updateMember
};
