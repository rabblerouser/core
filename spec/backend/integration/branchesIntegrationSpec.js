'use strict';
require('../../support/specHelper');
const integrationTestHelpers = require('./integrationTestHelpers.js');

let request = require('supertest-as-promised');
const instanceUrl = process.env.INSTANCE_URL;
let app = instanceUrl ? instanceUrl : require('../../../src/backend/app');

let listOfBranches = (res) => {
    if (!('branches' in res.body)) {
        throw new Error('branches not found');
    }
};

let listOfGroups = (res) => {
    if (!('groups' in res.body)) {
        throw new Error('groups not found');
    }
};

let listOfAdmins = (res) => {
    if (!('admins' in res.body)) {
        throw new Error('admins not found');
    }
};

let getBranches = () => {
    return request(app)
        .get('/branches')
        .expect(200)
        .expect(listOfBranches);
};

describe('Branches Integration Test', () => {

    it('should return a list of branches', (done) => {
        getBranches()
            .then(done, done.fail);
    }, 60000);

    it('should return a list of groups for a branch', (done) => {
        let agent = request.agent(app);

        integrationTestHelpers.createBranch()
        .tap(integrationTestHelpers.createUser)
        .tap(integrationTestHelpers.authenticateOrganiser(agent))
        .then((branch) => {
            return agent
                .get(`/branches/${branch.id}/groups`)
                .expect(200)
                .expect(listOfGroups);
        })
        .then(done, done.fail);
    });

    it('should return a list of admins for a branch', (done) => {
        let agent = request.agent(app);

        integrationTestHelpers.createBranch()
        .tap(integrationTestHelpers.createUser)
        .tap(integrationTestHelpers.authenticateOrganiser(agent))
        .then((branch) => {
            return agent
                .get(`/branches/${branch.id}/admins`)
                .expect(200)
                .expect(listOfAdmins);
        })
        .then(done, done.fail);
    });

    it('should return the list of branches the admin user has access to', (done) => {
        let agent = request.agent(app);

        integrationTestHelpers.createBranch()
        .tap(integrationTestHelpers.createUser)
        .tap(integrationTestHelpers.authenticateOrganiser(agent))
        .then((branch) => {
            return agent.get('/admin/branches')
                .expect(200)
                .then((res) => {
                    expect(res.body.branches).not.toBeNull();
                    expect(res.body.branches.length).toEqual(1);
                    expect(res.body.branches[0].id).toEqual(branch.id);
                });
        })
        .then(done, done.fail);
    });

    it('should return a list of all branches for a super admin', (done) => {
        let agent = request.agent(app);

        integrationTestHelpers.createBranch()
        .then(integrationTestHelpers.createBranch)
        .then(integrationTestHelpers.createBranch)
        .tap(integrationTestHelpers.createSuperAdmin)
        .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
        .then(() => {
            return agent.get('/admin/branches')
                .expect(200)
                .then((res) => {
                    expect(res.body.branches).not.toBeNull();
                    expect(res.body.branches.length).toEqual(3);
                });
        })
        .then(done, done.fail);
    });
});
