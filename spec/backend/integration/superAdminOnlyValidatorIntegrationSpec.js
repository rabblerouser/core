'use strict';

require('../../support/specHelper');
const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');
let request = require('supertest-as-promised');
let integrationTestHelpers = require('./integrationTestHelpers.js');

describe('SuperAdminOnlyValidator Integration tests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
    });

    it('should respond with 401 when users try to access something they are NOT entitled to see', (done) => {
            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createBranchAdmin)
            .then(integrationTestHelpers.authenticateOrganiser(agent))
            .then(() => {
                return agent.post(`/branches`)
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Melbourne',
                    notes: 'organiser',
                    contact: 'hey i\'m a contact',
                })
                .expect(401);
            })
            .then(done, done.fail);
    });

    it('should respond with 200 when a super admin tries to access a superadmin only resource', (done) => {
        integrationTestHelpers.createSuperAdmin()
        .then(integrationTestHelpers.authenticateSuperAdmin(agent))
        .then(() => {
            return agent.post(`/branches`)
                .set('Content-Type', 'application/json')
                .send({
                    name: 'Melbourne',
                    notes: 'organiser',
                    contact: 'hey i\'m a contact',
                })
                .expect(200);
    })
    .then(done, done.fail);
    });
});
