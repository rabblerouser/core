'use strict';
const times = require('lodash').times;
const uuid = require('node-uuid');
let models = require('../../../src/backend/models'),
    AdminUser = models.AdminUser,
    Branch = models.Branch,
    Group = models.Group;
let adminType = require('../../../src/backend/security/adminType');

function createUser(branch) {
    return AdminUser.create({ email: 'orgnsr@thelab.org', password: 'organiser', branchId: branch.id, id: uuid.v4()});
}

function createSuperAdmin() {
    return AdminUser.create({ email: 'super@thelab.org', password: 'super', type: adminType.super, id: uuid.v4()});
}

function authenticateOrganiser(someAgent) {
    return function() {
        return someAgent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'orgnsr@thelab.org', password: 'organiser' })
            .expect(302);
    };
}

function authenticateSuperAdmin(someAgent) {
    return function() {
        return someAgent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'super@thelab.org', password: 'super' })
            .expect(302);
    };
}

function createBranch() {
    return Branch.create({
        name:'Fake Branch',
        id: uuid.v4(),
        notes: 'Some notes for this branch, only meant to be seen by super users',
        conact: 'jerry@seinfield.com'
    })
    .then((sequelizeResult) => {
        return sequelizeResult.dataValues;
    });
}

function createGroupInBranch(branchId) {
    return Group.create({name: 'Groupalicious', description: 'Groups yeah', id: uuid.v4()})
    .then((group) => {
        return Branch.findOne({where: {id: branchId}})
        .then((branch) => {
            return branch.addGroup(group);
        })
        .then((sequelizeResult) => {
            return sequelizeResult[0][0].dataValues;
        });
    });
}

let makeMember = (branchId) => {
    return {
        'contactFirstName': 'Jaime',
        'contactLastName': 'Garzon',
        'schoolType': 'Primary',
        'branchId': branchId,
        'firstName': 'Sherlock',
        'lastName': 'Holmes',
        'email': 'sherlock@holmes.co.uk',
        'dateOfBirth': '01/01/1983',
        'primaryPhoneNumber': '0396291146',
        'secondaryPhoneNumber': null,
        'gender': 'horse radish',
        'residentialAddress': {
            'address': '222b Baker St',
            'suburb': 'London',
            'country': 'England',
            'state': 'VIC',
            'postcode': '1234'
        },
        'postalAddress': {
            'address': '303 collins st',
            'suburb': 'melbourne',
            'country': 'australia',
            'state': 'VIC',
            'postcode': '3000'
        },
        'membershipType': 'full'
    };
};

function createMembers(agent, numberOfMembers) {
    return function(branch) {
        let createTheseMembers = [];
        times(numberOfMembers, () => {
            createTheseMembers.push(
                agent
                    .post('/register')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeMember(branch.id))
            );
        });
        return Promise.all(createTheseMembers);
    };
}

module.exports = {
    createUser: createUser,
    authenticateOrganiser: authenticateOrganiser,
    createBranch: createBranch,
    createMembers: createMembers,
    makeMember: makeMember,
    createGroupInBranch: createGroupInBranch,
    createSuperAdmin: createSuperAdmin,
    authenticateSuperAdmin: authenticateSuperAdmin
};
