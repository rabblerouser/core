'use strict';

const times = require('lodash').times;
const uuid = require('node-uuid');
const moment = require('moment');

const models = require('../../src/models');

const AdminUser = models.AdminUser;
const Branch = models.Branch;
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

const makeMember = branchId => ({
  branchId,
  id: uuid.v4(),
  memberSince: moment(),
  name: 'Sherlock Holmes',
  email: 'sherlock@holmes.co.uk',
  phoneNumber: '0396291146',
  address: {
    address: '303 collins st',
    suburb: 'melbourne',
    country: 'australia',
    state: 'VIC',
    postcode: '3000',
  },
});

const getSequenceNumber = (() => {
  let sequenceNumber = -1;
  return () => {
    sequenceNumber += 1;
    return sequenceNumber.toString();
  };
})();

const makeEvent = event => ({
  sequenceNumber: getSequenceNumber(),
  data: new Buffer(JSON.stringify(event)).toString('base64'),
});

const makeMemberRegisteredEvent = branchId => makeEvent({
  type: 'member-registered',
  data: makeMember(branchId),
});

const makeMemberEditedEvent = member => makeEvent({
  type: 'member-edited',
  data: member,
});

function createMembers(agent, numberOfMembers) {
  return branch => {
    let promise = Promise.resolve();
    times(numberOfMembers, () => {
      promise = promise.then(() => (
        agent.post('/events')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', 'secret')
          .send(makeMemberRegisteredEvent(branch.id))
          .expect(200)
      ));
    });
    return promise;
  };
}

function addMembersToGroup(agent, groupId) {
  return members => {
    let promise = Promise.resolve();
    members.forEach(member => {
      const updatedMember = Object.assign({}, member, { groups: [groupId] });
      promise = promise.then(() => (
        agent.post('/events')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', 'secret')
          .send(makeMemberEditedEvent(updatedMember))
          .expect(200)
      ));
    });
    return promise;
  };
}

function createGroup(agent, branchId) {
  const group = { id: uuid.v4(), branchId, name: 'Groupalicious', description: 'Groups yeah' };
  const groupEvent = makeEvent({ type: 'group-created', data: group });

  return agent.post('/events')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', 'secret')
    .send(groupEvent)
    .expect(200)
    .then(() => group.id);
}

function resetDatabase() {
  return Promise.resolve()
    .then(() => AdminUser.truncate({ cascade: true }))
    .then(() => Branch.truncate({ cascade: true }));
}

module.exports = {
  createBranchAdmin,
  authenticateBranchAdmin,
  createBranch,
  createMembers,
  addMembersToGroup,
  makeMember,
  createGroup,
  createSuperAdmin,
  authenticateSuperAdmin,
  resetDatabase,
};
