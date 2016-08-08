'use strict';

const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/app');
let request = require('supertest-as-promised');
let integrationTestHelpers = require('./integrationTestHelpers.js');

describe('SuperAdminOnlyValidator Integration tests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
        return integrationTestHelpers.resetDatabase();
    });

    it('should respond with 401 when users try to access something they are NOT entitled to see', () => {
        return integrationTestHelpers.createBranch()
        .then(integrationTestHelpers.createBranchAdmin)
        .then(integrationTestHelpers.authenticateBranchAdmin(agent))
        .then(() => {
            return agent.post(`/branches`)
            .set('Content-Type', 'application/json')
            .send({
                name: 'Melbourne',
                notes: 'organiser',
                contact: 'hey i\'m a contact',
            })
            .expect(401);
        });
    });

    it('should respond with 200 when a super admin tries to access a superadmin only resource', () => {
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
        });
    });
});
