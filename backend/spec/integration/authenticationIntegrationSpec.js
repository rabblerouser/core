'use strict';

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');
const request = require('supertest-as-promised');
const integrationTestHelpers = require('./integrationTestHelpers.js');

describe('PathAccessValidator Integration tests', () => {
  let agent;

  beforeEach(() => {
    agent = request.agent(app);


    return integrationTestHelpers.resetDatabase()
        .then(() => integrationTestHelpers.createBranch())
        .then(integrationTestHelpers.createBranchAdmin)
        .then(integrationTestHelpers.authenticateBranchAdmin(agent));
  });

  it('should respond with 401 when users try to access they are NOT entitled to see', () => {
    const aDifferentBranchId = 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174';

    return agent.get(`/branches/${aDifferentBranchId}/members`)
        .expect(401);
  });

  it('should respond with 401 when users try to access a branch path with no branch id', () => {
    let aDifferentBranchId;

    return agent.get(`/branches/${aDifferentBranchId}/members`)
      .expect(401);
  });
});
