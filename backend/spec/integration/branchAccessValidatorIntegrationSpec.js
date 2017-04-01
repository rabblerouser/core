'use strict';

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');
const request = require('supertest-as-promised');
const integrationTestHelpers = require('./integrationTestHelpers.js');

describe('BranchAccessValidator Integration tests', () => {
  let agent;
  let wrongBranchId;

  beforeEach(() => {
    agent = request.agent(app);

    return integrationTestHelpers.resetDatabase()
        .then(() => integrationTestHelpers.createBranch(agent))
        .then(branch => { wrongBranchId = branch.id; })
        .then(() => integrationTestHelpers.createBranch(agent))
        .then(integrationTestHelpers.createBranchAdmin(agent))
        .then(integrationTestHelpers.authenticateBranchAdmin(agent));
  });

  it('should respond with 404 when users try to access they are NOT entitled to see', () => (
    agent.get(`/branches/${wrongBranchId}/members`)
      .expect(401)
  ));

  it('should respond with 404 when users try to access a branch path with no branch id', () => (
    agent.get('/branches//members')
      .expect(404)
  ));

  it('should respond 200 when a super admin is trying to access data for a branch', () => (
    integrationTestHelpers.createBranch(agent)
      .then(integrationTestHelpers.createSuperAdmin(agent))
      .then(integrationTestHelpers.authenticateSuperAdmin(agent))
      .then(() => integrationTestHelpers.createBranch(agent))
      .then(aDifferentBranch => agent.get(`/branches/${aDifferentBranch.id}/members`)
        .expect(200)
      )
  ));
});
