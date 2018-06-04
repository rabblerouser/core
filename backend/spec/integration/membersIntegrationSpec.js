'use strict';

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');
const request = require('supertest-as-promised');
const sample = require('lodash').sample;
const integrationTestHelpers = require('./integrationTestHelpers.js');

function getMembers(someAgent, state) {
  return () => (
    someAgent.get(`/branches/${state.branch.id}/members`)
      .then(response => response.body.members)
  );
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

const getBranchId = someAgent => () => (
  someAgent
    .get('/branches')
    .then(response => sample(response.body.branches).id)
);

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
  return newState => {
    obj[key] = newState;
    return newState;
  };
}

describe('MemberIntegrationTests', () => {
  let agent;
  let browserState;

  beforeEach(() => {
    agent = request.agent(app);
    browserState = {};
    return integrationTestHelpers.resetDatabase();
  });

  describe('Register', () => {
    beforeEach(() => integrationTestHelpers.resetDatabase()
            .then(() => integrationTestHelpers.createBranch(agent))
            .then(getBranchId(agent))
            .then(branchId => {
              browserState.branchId = branchId;
            }));

    it('should return 201 when the input is valid', () => (
      agent.post('/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(integrationTestHelpers.makeMember(browserState.branchId))
        .expect(201))
    );

    it('should safely create a member with dodgy information', () => {
      const dodgyMember = integrationTestHelpers.makeMember(browserState.branchId);
      dodgyMember.additionalInfo = '\'); DROP TABLE MEMBERS';

      return agent.post('/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(dodgyMember)
        .expect(201);
    });

    it('should return 200 when creating a member with no address', () =>
      agent.post('/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(makeMemberWithNoAddress(browserState.branchId))
        .expect(201));

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
    it('finds a list of members for an organiser', () => integrationTestHelpers.createBranch(agent)
            .tap(integrationTestHelpers.createBranchAdmin(agent))
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then(branch => agent.get(`/branches/${branch.id}/members`))
            .then(hasMembersList));

    it('only authenticated organisers can access the members list', () => integrationTestHelpers.createBranch(agent)
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .then(branch => agent.get(`/branches/${branch.id}/members`)
                .expect(302)));
  });

  describe('Edit member', () => {
    beforeEach(() => (
      integrationTestHelpers.resetDatabase()
        .then(() => integrationTestHelpers.createBranch(agent))
        .then(setState(browserState, 'branch'))
        .then(branch => integrationTestHelpers.createBranchAdmin(agent)(branch).then(() => branch))
        .then(integrationTestHelpers.createMembers(agent, 1))
        .then(() => integrationTestHelpers.createGroup(agent, browserState.branch.id))
        .then(() => integrationTestHelpers.createGroup(agent, browserState.branch.id))
        .then(setState(browserState, 'groups'))
        .then(integrationTestHelpers.authenticateBranchAdmin(agent))
        .then(getMembers(agent, browserState))
        .then(setState(browserState, 'members'))
    ));

    it('should successfully edit the member', () => {
      const member = sample(browserState.members);
      const branchId = browserState.branch.id;

      member.name = 'Super Test';

      return agent.put(`/branches/${branchId}/members/${member.id}`)
        .set('Content-Type', 'application/json')
        .send(editMember(member, []))
        .expect(201);
    });

    it('should add an address to a member without one', () => {
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
        .expect(201);
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
