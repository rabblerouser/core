'use strict';

const Q = require('q');
const models = require('../models');
const logger = require('../lib/logger');
const moment = require('moment');
const Address = models.Address;
const Group = models.Group;
const Member = models.Member;
const uuid = require('node-uuid');
const branchService = require('./branchService');
const pluck = require('lodash').pluck;

function createHash() {
  return uuid.v4();
}

function save(member) {
  return Member.create.bind(Member)(member);
}

function handleError(message) {
  return error => {
    logger.error(message, { error: error.stack });
    return models.Sequelize.Promise.reject(message);
  };
}

function parse(input, residentialAddress, postalAddress) {
  const residentialAddressId = residentialAddress ? residentialAddress[0].dataValues.id : null;
  const postalAddressId = postalAddress ? postalAddress[0].dataValues.id : null;


  return Object.assign({}, input, {
    dateOfBirth: input.dateOfBirth ? moment(input.dateOfBirth, 'DD/MM/YYYY').toDate() : null,
    residentialAddressId,
    postalAddressId,
  });
}

function setupNewMember(newMember) {
  return (residentialAddress, postalAddress) => {
    const memberToSave = parse(newMember, residentialAddress, postalAddress);
    return Object.assign({}, memberToSave, { id: createHash(), memberSince: moment() });
  };
}

function logEvent(saveResult) {
  logger.info('[member-sign-up-event]', saveResult.dataValues);
}

function findOrCreateAddress(address) {
  return Q(Address.findOrCreate({ where: address, defaults: address }));
}

function getMemberAddresses(member) {
  const memberAddresses = [];

  if (member.residentialAddress) {
    memberAddresses.push(findOrCreateAddress(member.residentialAddress));
  }

  if (member.postalAddress) {
    memberAddresses.push(findOrCreateAddress(member.postalAddress));
  }

  return memberAddresses;
}

function assignToBranch(branchId) {
  return member =>
    branchService
      .findById(branchId)
      .then(branch => Object.assign({}, member, { branchId: branch.id }));
}

const createMember = newMember =>
  Q
    .all(getMemberAddresses(newMember))
    .spread(setupNewMember(newMember))
    .then(assignToBranch(newMember.branchId))
    .then(save)
    .tap(logEvent)
    .then(savedMember => savedMember.dataValues)
    .catch(handleError('Create Member failed'));

function transformMember(dbMember) {
  return Object.assign({}, dbMember.dataValues, {
    groups: pluck(dbMember.dataValues.groups, 'dataValues.id'),
  });
}

function transformMembers(adapter) {
  return memberQueryResult => memberQueryResult.map(adapter);
}

function list(branchId) {
  if (!branchId) {
    return Q.resolve([]);
  }

  const query = {
    include: [{
      model: Group,
      as: 'groups',
      through: { attributes: ['name'] },
    }],
    attributes: [
      'id',
      'firstName',
      'lastName',
      'primaryPhoneNumber',
      'secondaryPhoneNumber',
      'contactFirstName',
      'contactLastName',
      'dateOfBirth',
      'email',
      'schoolType',
      'additionalInfo',
      'membershipType',
      'memberSince',
      'branchId',
      'pastoralNotes',
    ],
    where: { branchId },
  };

  return Member
    .findAll(query)
    .then(transformMembers(transformMember))
    .catch(handleError('An error has occurred while fetching members'));
}

function updateMemberValues(newValues) {
  return Member
    .findOne({ where: { id: newValues.id } })
    .then(member => member.update(newValues));
}

function updateMemberGroups(groups) {
  return member =>
    member
      .setGroups(groups || [])
      .then(() =>
        member.reload({
          include: [{
            model: Group,
            as: 'groups',
            through: {
              attributes: ['id'],
            },
          }],
        })
      );
}

function edit(input) {
  return Member.sequelize.transaction(() =>
    Q
      .all(getMemberAddresses(input))
      .spread((residentialAddress, postalAddress) =>
        parse(input, residentialAddress, postalAddress)
      )
      .then(updateMemberValues)
      .then(updateMemberGroups(input.groups))
      .then(transformMember)
  )
    .then(updatedMember => {
      logger.info('[member-details-updated]', { member: updatedMember });
      return updatedMember;
    })
    .catch(handleError(`Error when editing member with id ${input.id}`));
}

module.exports = {
  createMember,
  list,
  edit,
};
