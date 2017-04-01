'use strict';

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');
const request = require('supertest-as-promised');
const integrationTestHelpers = require('./integrationTestHelpers.js');

describe('SuperAdminOnlyValidator Integration tests', () => {
  let agent;

  beforeEach(() => {
    agent = request.agent(app);
    return integrationTestHelpers.resetDatabase();
  });

  it('should respond with 401 when users try to access something they are NOT entitled to see', () => integrationTestHelpers.createBranch(agent)
        .then(integrationTestHelpers.createBranchAdmin(agent))
        .then(integrationTestHelpers.authenticateBranchAdmin(agent))
        .then(() => agent.post('/branches')
            .set('Content-Type', 'application/json')
            .send({
              name: 'Melbourne',
              notes: 'organiser',
              contact: 'hey i\'m a contact',
            })
            .expect(401)));

  it('should respond with 200 when a super admin tries to access a superadmin only resource', () => {
    integrationTestHelpers.createSuperAdmin(agent)
        .then(integrationTestHelpers.authenticateSuperAdmin(agent))
        .then(() => agent.post('/branches')
                .set('Content-Type', 'application/json')
                .send({
                  name: 'Melbourne',
                  notes: 'organiser',
                  contact: 'hey i\'m a contact',
                })
                .expect(200));
  });
});
