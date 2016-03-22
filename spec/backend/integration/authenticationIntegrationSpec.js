'use strict';
const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');
let request = require('supertest-as-promised');
let integrationTestHelpers = require('./integrationTestHelpers.js');

describe('PathAccessValidator Integration tests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
    });

    it('should respond with 401 when users try to access they are NOT entitled to see', (done) => {
        integrationTestHelpers.createBranch()
        .then(integrationTestHelpers.createBranchAdmin)
        .then(integrationTestHelpers.authenticateOrganiser(agent))
        .then(() => {
            let aDifferentBranchId = 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174';

            return agent.get(`/branches/${aDifferentBranchId}/members`);
        })
        .then((res) => {
            expect(res.status).toEqual(401);
        })
        .then(done, done.fail);
    });

    it('should respond with 401 when users try to access a branch path with no branch id', (done) => {
        integrationTestHelpers.createBranch()
        .then(integrationTestHelpers.createBranchAdmin)
        .then(integrationTestHelpers.authenticateOrganiser(agent))
        .then(() => {
            let aDifferentBranchId;

            return agent.get(`/branches/${aDifferentBranchId}/members`);
        })
        .then((res) => {
            expect(res.status).toEqual(401);
        })
        .then(done, done.fail);
    });
});
