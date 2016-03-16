'use strict';
const pluck = require('lodash').pluck;
const map = require('lodash').map;
const times = require('lodash').times;
const uuid = require('node-uuid');
let models = require('../../../src/backend/models'),
    AdminUser = models.AdminUser,
    Branch = models.Branch,
    Group = models.Group;

function createUser(branch) {
    return AdminUser.create({ email: 'orgnsr@thelab.org', password: 'organiser', branchId: branch.id });
}

function authenticate(someAgent) {
    return function() {
        return someAgent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'orgnsr@thelab.org', password: 'organiser' })
            .expect(302);
    };
}

function createBranch() {
    return Branch.create({name:'Fake Branch', id: uuid.v4()})
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
        'branch': branchId,
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

function createFakeMembers(agent, numberOfMembers) {
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
    authenticate: authenticate,
    createBranch: createBranch,
    createFakeMembers: createFakeMembers,
    makeMember: makeMember,
    createGroupInBranch: createGroupInBranch
};
