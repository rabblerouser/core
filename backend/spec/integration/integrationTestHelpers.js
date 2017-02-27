'use strict';

const times = require('lodash').times;
const uuid = require('node-uuid');
const models = require('../../src/models');

const Address = models.Address;
const Member = models.Member;
const AdminUser = models.AdminUser;
const Branch = models.Branch;
const BranchGroup = models.BranchGroup;
const Group = models.Group;
const adminType = require('../../src/security/adminType');

function createBranchAdmin(branch) {
  return AdminUser.create({ email: 'orgnsr@rabblerouser.org', password: 'organiser', branchId: branch.id, id: uuid.v4() });
}

function createSuperAdmin() {
  return AdminUser.create({ email: 'super@rabblerouser.org', password: 'super', type: adminType.super, id: uuid.v4() });
}

function authenticateBranchAdmin(someAgent) {
  return function () {
    return someAgent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'orgnsr@rabblerouser.org', password: 'organiser' })
            .expect(302);
  };
}

function authenticateSuperAdmin(someAgent) {
  return function () {
    return someAgent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'super@rabblerouser.org', password: 'super' })
            .expect(302);
  };
}

function createBranch() {
  return Branch.create({
    name: 'Fake Branch',
    id: uuid.v4(),
    notes: 'Some notes for this branch, only meant to be seen by super users',
    conact: 'jerry@seinfield.com',
  })
    .then(sequelizeResult => sequelizeResult.dataValues);
}

function createGroupInBranch(branchId) {
  return Group.create({ name: 'Groupalicious', description: 'Groups yeah', id: uuid.v4() })
    .then(group => Branch.findOne({ where: { id: branchId } })
        .then(branch => branch.addGroup(group))
        .then(sequelizeResult => sequelizeResult[0][0].dataValues));
}

const makeMember = branchId => ({
  branchId,
  firstName: 'Sherlock',
  lastName: 'Holmes',
  email: 'sherlock@holmes.co.uk',
  primaryPhoneNumber: '0396291146',
  secondaryPhoneNumber: null,
  gender: 'horse radish',
  residentialAddress: {
    address: '222b Baker St',
    suburb: 'London',
    country: 'England',
    state: 'VIC',
    postcode: '1234',
  },
  postalAddress: {
    address: '303 collins st',
    suburb: 'melbourne',
    country: 'australia',
    state: 'VIC',
    postcode: '3000',
  },
  membershipType: 'full',
});

const makeMemberRegisteredEvent = branchId => {
  const event = {
    type: 'member-registered',
    data: makeMember(branchId),
  };
  return {
    sequenceNumber: '1',
    data: new Buffer(JSON.stringify(event)).toString('base64'),
  };
};

function createMembers(agent, numberOfMembers) {
  return function (branch) {
    const createTheseMembers = [];
    times(numberOfMembers, () => {
      createTheseMembers.push(
                agent
                    .post('/events')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'secret')
                    .send(makeMemberRegisteredEvent(branch.id))
                    .expect(200)
            );
    });
    return Promise.all(createTheseMembers);
  };
}

function resetDatabase() {
  return Address.truncate({ cascade: true })
    .then(() => Member.truncate({ cascade: true }))
    .then(() => AdminUser.truncate({ cascade: true }))
    .then(() => BranchGroup.truncate({ cascade: true }))
    .then(() => Group.truncate({ cascade: true }))
    .then(() => Branch.truncate({ cascade: true }));
}

module.exports = {
  createBranchAdmin,
  authenticateBranchAdmin,
  createBranch,
  createMembers,
  makeMember,
  createGroupInBranch,
  createSuperAdmin,
  authenticateSuperAdmin,
  resetDatabase,
};
