'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    Address = models.Address,
    Group = models.Group,
    Member = models.Member,
    uuid = require('node-uuid'),
    branchService = require('./branchService'),
    pluck = require('lodash').pluck;


function createHash() {
  return uuid.v4();
}

function save(member) {
  return Member.create.bind(Member)(member);
}

function handleError(message) {
    return function(error) {
        logger.error(message, { error: error.stack });
        return models.Sequelize.Promise.reject(message);
    };
}

function parse(input, residentialAddress, postalAddress) {
    let residentialAddressId = residentialAddress ? residentialAddress[0].dataValues.id : null;
    let postalAddressId = postalAddress ? postalAddress[0].dataValues.id : null;


    return Object.assign({}, input, {
        dateOfBirth: input.dateOfBirth ? moment(input.dateOfBirth, 'DD/MM/YYYY').toDate() : null,
        residentialAddressId: residentialAddressId,
        postalAddressId: postalAddressId
    });
}

function setupNewMember(newMember) {
  return function (residentialAddress, postalAddress) {
    let memberToSave = parse(newMember, residentialAddress, postalAddress);

    return Object.assign({}, memberToSave, {id: createHash(), memberSince: moment()});
  };
}

function logEvent(saveResult) {
    logger.info('[member-sign-up-event]', saveResult.dataValues);
}

function findOrCreateAddress(address) {
    return Q(Address.findOrCreate({where: address, defaults: address}));
}

function getMemberAddresses(member) {
    let memberAddresses = [];

    if (member.residentialAddress) {
        memberAddresses.push(findOrCreateAddress(member.residentialAddress));
    }

    if (member.postalAddress) {
        memberAddresses.push(findOrCreateAddress(member.postalAddress));
    }

    return memberAddresses;
}

function assignToBranch(branchId) {
    return function (member) {
        return branchService.findById(branchId)
        .then((branch) => {
            return Object.assign({}, member, {branchId: branch.id});
        });
    };
}

let createMember = (newMember) => {
    return Q.all(getMemberAddresses(newMember))
          .spread(setupNewMember(newMember))
          .then(assignToBranch(newMember.branchId))
          .then(save)
          .tap(logEvent)
          .then((savedMember) => {
            return  savedMember.dataValues;
          })
          .catch(handleError('Create Member failed'));
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
            return Member.update(updatedMember, {where: {email: member.email}});
        })
        .tap(function(updatedMember){
            logger.info('[member-details-updated]', {member: updatedMember});
        })
        .catch((error) => {
            logger.error('[member-update-error]', {error: error.toString()});
            return Q.reject(error);
        });
};

function transformMember(dbMember) {
    return Object.assign({}, dbMember.dataValues, {
        groups: pluck(dbMember.dataValues.groups, 'dataValues.id')
    });
}

function transformMembers(adapter) {
    return function (memberQueryResult) {
        return memberQueryResult.map(adapter);
    };
}

function list(branchId) {
    if (!branchId) {
        return Q.resolve([]);
    }

    let query = {
        include: [
            {
                model: Group,
                as: 'groups',
                through: {
                    attributes: ['name']
                }
            }
        ],
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
            'branchId'
        ],
        where: {
            branchId: branchId
        }
    };

    return Member.findAll(query)
        .then(transformMembers(transformMember))
        .catch(handleError('An error has occurred while fetching members'));
}

function edit(input) {
    return Member.sequelize.transaction(() => {
        return Q.all(getMemberAddresses(input))
        .spread((residentialAddress, postalAddress) => {
            return parse(input, residentialAddress, postalAddress);
        })
        .then((newValues) => {
            return Member.findOne({where: {id: input.id}})
            .then( member => {
                return member.update(newValues);
            });
        })
        .then(member => {
            let groups = input.groups || [];
            return member.setGroups(groups)
            .then(() => {
                return member.reload({
                    include: [
                        {
                            model: Group,
                            as: 'groups',
                            through: {
                                attributes: ['id']
                            }
                        }
                    ]});
            })
            .then((result) => {
                return transformMember(result);
            });
        });
    })
    .then(updatedMember => {
        logger.info('[member-details-updated]', {member: updatedMember});
        return updatedMember;
    })
    .catch(handleError(`Error when editing member with id ${input.id}`));
}
module.exports = {
    createMember: createMember,
    updateMember: updateMember,
    list: list,
    edit: edit
};
