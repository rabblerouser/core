'use strict';
const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../src/app');
let request = require('supertest-as-promised');
let integrationTestHelpers = require('./integrationTestHelpers.js');

describe('PathAccessValidator Integration tests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);

        return integrationTestHelpers.resetDatabase()
        .then(integrationTestHelpers.createBranch)
        .then(integrationTestHelpers.createBranchAdmin)
        .then(integrationTestHelpers.authenticateBranchAdmin(agent));
    });

    it('should respond with 401 when users try to access they are NOT entitled to see', () => {
        let aDifferentBranchId = 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174';

        return agent.get(`/branches/${aDifferentBranchId}/members`)
        .expect(401);
    });

    it('should respond with 401 when users try to access a branch path with no branch id', () => {
            let aDifferentBranchId;

            return agent.get(`/branches/${aDifferentBranchId}/members`)
            .expect(401);
    });

    it('should respond 200 when a super admin is trying to access data for a branch', () => {
        return integrationTestHelpers.createBranch()
        .then(integrationTestHelpers.createSuperAdmin)
        .then(integrationTestHelpers.authenticateSuperAdmin(agent))
        .then(integrationTestHelpers.createBranch)
        .then((aDifferentBranch) => {
            return agent.get(`/branches/${aDifferentBranch.id}/members`)
            .expect(200);
        });
    });
});
