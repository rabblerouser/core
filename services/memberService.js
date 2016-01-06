'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    Address = models.Address,
    Member = models.Member;

var createMember = (newMember) => {
    return Q.all([
            Q(Address.findOrCreate({where: newMember.residentialAddress, defaults: newMember.residentialAddress})),
            Q(Address.findOrCreate({where: newMember.postalAddress, defaults: newMember.postalAddress}))
        ])
        .spread((residentialAddress, postalAddress) => {
            return Q({
                firstName: newMember.firstName,
                lastName: newMember.lastName,
                email: newMember.email,
                gender: newMember.gender,
                dateOfBirth: moment(newMember.dateOfBirth, "DD/MM/YYYY").toDate(),
                primaryPhoneNumber: newMember.primaryPhoneNumber,
                secondaryPhoneNumber: newMember.secondaryPhoneNumber,
                residentialAddress: residentialAddress[0].dataValues.id,
                postalAddress: postalAddress[0].dataValues.id
            });
        })
        .then(Member.create.bind(Member))
        .then(logger.info(newMember))
        .catch((error) => {
            return Q.reject(error);
        });
};

module.exports = {
    createMember: createMember
};
