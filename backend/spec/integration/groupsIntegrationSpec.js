'use strict';

const request = require('supertest-as-promised');
const integrationTestHelpers = require('./integrationTestHelpers');
const uuid = require('node-uuid');

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');

function getMembersForGroup(someAgent, branchId) {
  return () => (
    someAgent.get(`/branches/${branchId}/members`)
      .then(response => response.body.members)
  );
}

function makeGroup() {
  return {
    name: 'Waiting List',
    description: 'This is a description of the waiting list',
  };
}

function hasGroup(res) {
  const response = res.body;

  if (!(response.id && response.name === 'Waiting List')) {
    throw new Error('created group failed');
  }
}

describe('Groups Integration Test', () => {
  let agent;
  const browserState = {};

  beforeEach(() => {
    agent = request.agent(app);

    return integrationTestHelpers.resetDatabase()
      .then(integrationTestHelpers.createBranch)
      .then(branch => { browserState.branch = branch; return branch; })
      .then(integrationTestHelpers.createBranchAdmin)
      .then(integrationTestHelpers.authenticateBranchAdmin(agent));
  });

  describe('create group for a branch', () => {
    it('should return 200 when the group is successfully created', () => (
      agent.post(`/branches/${browserState.branch.id}/groups`)
        .set('Content-Type', 'application/json')
        .send(makeGroup())
        .expect(200)
        .expect(hasGroup)
    ));

    it('should return 400 if group input data is not valid', () => (
      agent.post(`/branches/${browserState.branch.id}/groups`)
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400)
    ));
  });

  describe('update group', () => {
    it('should return a 200 when the group is successfully updated', () => (
      integrationTestHelpers.createGroup(agent, browserState.branch.id)
        .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
        .then(groupId => agent.put(`/branches/${browserState.branch.id}/groups/${groupId}`)
          .set('Content-Type', 'application/json')
          .send(makeGroup())
          .expect(200)
          .expect(hasGroup))
    ));
  });

  describe('delete group', () => {
    beforeEach(() => (
      integrationTestHelpers.createGroup(agent, browserState.branch.id)
        .then(groupId => {
          browserState.groupId = groupId;
        })
    ));

    it('should return a 200 when the group is successfully deleted', () => (
      agent.delete(`/branches/${browserState.branch.id}/groups/${browserState.groupId}`)
        .expect(200)
    ));

    it('should return a 200 when a group with members is deleted', () => (
      integrationTestHelpers.createMembers(agent, 2)(browserState.branch)
        .then(getMembersForGroup(agent, browserState.branch.id))
        .then(integrationTestHelpers.addMembersToGroup(agent, browserState.groupId))
        .then(() => agent.delete(`/branches/${browserState.branch.id}/groups/${browserState.groupId}`)
        .expect(200))
    ));

    it('should return a 404 if the input data is not valid', () => (
      agent.delete(`/branches/${browserState.branch.id}/groups/whatevs`)
        .expect(404)
    ));

    it('should return 404 when trying to delete a group that does not exist', () => (
      agent.delete(`/branches/${browserState.branch.id}/groups/${uuid.v4()}`)
        .expect(404)
    ));
  });
});
