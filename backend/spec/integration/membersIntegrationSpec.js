'use strict';

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');
const request = require('supertest-as-promised');
const sample = require('lodash').sample;
const pluck = require('lodash').pluck;
const integrationTestHelpers = require('./integrationTestHelpers.js');
const Q = require('q');

function getMembers(someAgent, state) {
  return function () {
    return someAgent.get(`/branches/${state.branch.id}/members`)
        .then(response => response.body.members);
  };
}

function editMember(member, groups) {
  groups = groups || [];
  return Object.assign({}, member, { groups, branch: member.branchId });
}

function hasMembersList(res) {
  const response = res.body;
  expect(response.members).not.to.eql(null);
  expect(response.members.length).to.equal(3);

  const randomMember = sample(response.members);
  expect(randomMember.address.address).not.to.eql(null);
  expect(randomMember.address.suburb).not.to.eql(null);
  expect(randomMember.address.city).not.to.eql(null);
  expect(randomMember.address.postcode).not.to.eql(null);
  expect(randomMember.address.country).not.to.eql(null);
}

const getBranchId = someAgent => function () {
  return someAgent
        .get('/branches')
        .then(response => sample(response.body.branches).id);
};

const makeMemberWithNoAddress = branchId => {
  const member = integrationTestHelpers.makeMember(branchId);
  member.address = null;

  return member;
};

const makeInvalidMember = () => {
  const member = integrationTestHelpers.makeMember();
  member.name = null;
  return member;
};

function setState(obj, key) {
  return function (newState) {
    obj[key] = newState;
    return newState;
  };
}

describe('MemberIntegrationTests', () => {
  let agent;
  const browserState = {};

  beforeEach(() => {
    agent = request.agent(app);
    return integrationTestHelpers.resetDatabase();
  });

  describe('Register', () => {
    beforeEach(() => integrationTestHelpers.resetDatabase()
            .then(integrationTestHelpers.createBranch)
            .then(getBranchId(agent))
            .then(branchId => {
              browserState.branchId = branchId;
            }));

    xit('should return 200 and a created member when the input is valid', () =>
            // Test excluded until we get better docker automation of a local kinesis instance
             agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(integrationTestHelpers.makeMember(browserState.branchId))
                .expect(200));

    xit('should safely create a member with dodgy information', () => {
            // Test excluded until we get better docker automation of a local kinesis instance
      const dodgyMember = integrationTestHelpers.makeMember(browserState.branchId);
      dodgyMember.additionalInfo = '\'); DROP TABLE MEMBERS';

      return agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(dodgyMember)
                .expect(200);
    });

    xit('should return 200 when creating a member with no address', () =>
            // Test excluded until we get better docker automation of a local kinesis instance
             agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(makeMemberWithNoAddress(browserState.branchId))
            .expect(200));

    it('should return 400 if the input is null', () => agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(null)
            .expect(400));

    it('should return 400 if the input is incomplete', () => agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(makeInvalidMember())
            .expect(400));
  });

  describe('list of members', () => {
    it('finds a list of members for an organiser', () => integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then(branch => agent.get(`/branches/${branch.id}/members`))
            .then(hasMembersList));

    it('only authenticated organisers can access the members list', () => integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .then(branch => agent.get(`/branches/${branch.id}/members`)
                .expect(302)));
  });

  describe('Edit member', () => {
    beforeEach(() => integrationTestHelpers.resetDatabase()
            .then(integrationTestHelpers.createBranch)
            .then(setState(browserState, 'branch'))
            .then(branch => { integrationTestHelpers.createBranchAdmin(branch); return branch; })
            .then(integrationTestHelpers.createMembers(agent, 1))
            .then(() => Q.all([
              integrationTestHelpers.createGroupInBranch(browserState.branch.id),
              integrationTestHelpers.createGroupInBranch(browserState.branch.id),
            ]))
            .then(setState(browserState, 'groups'))
            .then(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then(getMembers(agent, browserState))
            .then(setState(browserState, 'members')));

    xit('should edit the member with the new values', () => {
      // Test excluded until we get better docker automation of a local kinesis instance
      const member = sample(browserState.members);
      const branchId = browserState.branch.id;

      member.name = 'Super Test';

      return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(200)
                .expect(response => {
                  expect(response.body.name).to.equal('Super Test');
                });
    });

    xit('should add an address to a member without one', () => {
      // Test excluded until we get better docker automation of a local kinesis instance
      const member = sample(browserState.members);
      const newAddress = {
        address: 'Foo St',
        suburb: 'Bar',
        state: 'VIC',
        postcode: '0000',
        country: 'Baz',
      };
      member.address = Object.assign({}, newAddress);

      const branchId = browserState.branch.id;

      return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(200)
                .expect(response => {
                  const respAddress = response.body.address;
                  expect(respAddress.address).to.equal(newAddress.address);
                  expect(respAddress.suburb).to.equal(newAddress.suburb);
                  expect(respAddress.state).to.equal(newAddress.state);
                  expect(respAddress.postcode).to.equal(newAddress.postcode);
                  expect(respAddress.country).to.equal(newAddress.country);
                });
    });

    it('should respond 400 if invalid input', () => {
      const member = sample(browserState.members);
      const branchId = browserState.branch.id;

      member.name = null;

      return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(400);
    });
  });
});
