'use strict';

const times = require('lodash').times;
const uuid = require('node-uuid');
const moment = require('moment');
const hash = require('../../src/security/hash');
const adminType = require('../../src/security/adminType');
const store = require('../../src/store');

function authenticateBranchAdmin(someAgent) {
  return () => (
    someAgent
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'orgnsr@rabblerouser.org', password: 'organiser' })
      .expect(302)
  );
}

function authenticateSuperAdmin(someAgent) {
  return () => (
    someAgent
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'super@rabblerouser.org', password: 'super' })
      .expect(302)
  );
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

const sendEvent = (agent, eventType, eventData) => {
  const event = { type: eventType, data: eventData };
  return (
    agent.post('/events')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', 'secret')
      .send(makeEvent(event))
      .expect(200)
  );
};

function createMembers(agent, numberOfMembers) {
  return branch => {
    let promise = Promise.resolve();
    times(numberOfMembers, () => {
      promise = promise.then(() => sendEvent(agent, 'member-registered', makeMember(branch.id)));
    });
    return promise;
  };
}

function addMembersToGroup(agent, groupId) {
  return members => (
    members.reduce((promise, member) => {
      const updatedMember = Object.assign({}, member, { groups: [groupId] });
      return promise.then(() => sendEvent(agent, 'member-edited', updatedMember));
    }, Promise.resolve())
  );
}

function createGroup(agent, branchId) {
  const group = { id: uuid.v4(), branchId, name: 'Groupalicious', description: 'Groups yeah' };

  return sendEvent(agent, 'group-created', group)
    .then(() => group.id);
}

const createBranch = agent => {
  const branch = {
    name: 'Fake Branch',
    id: uuid.v4(),
    notes: 'Some notes for this branch',
    conact: 'jerry@seinfield.com',
  };

  return sendEvent(agent, 'branch-created', branch)
    .then(() => branch);
};

const createBranchAdmin = agent => branch => {
  const admin = { email: 'orgnsr@rabblerouser.org', password: hash('organiser'), type: adminType.branch, branchId: branch.id, id: uuid.v4() };
  return sendEvent(agent, 'admin-created', admin)
    .then(() => admin);
};

const createSuperAdmin = agent => {
  const admin = { email: 'super@rabblerouser.org', password: hash('super'), type: adminType.super, id: uuid.v4() };
  return sendEvent(agent, 'admin-created', admin)
    .then(() => admin);
};

const resetDatabase = () => Promise.resolve(store.reset());

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
