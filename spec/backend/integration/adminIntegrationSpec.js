'use strict';
const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');
let request = require('supertest-as-promised');
const sample = require('lodash').sample;
const pluck = require('lodash').pluck;
let integrationTestHelpers = require('./integrationTestHelpers.js');
let Q = require('../../support/specHelper').Q;
let uuid = require('node-uuid');

let hasNewAdmin = (res) => {
    if (!(res.body.email)) {
        throw new Error('missing created admin');
    }
};

let makeAdminUser = (branch) => {
    return {
        email: 'newOrgnrr@thelab.org',
        password: 'organiser',
        branchId: branch.id,
        id: uuid.v4()
    };
};

let makeInvalidUser = (branch) => {
    let admin = makeAdminUser(branch);
    admin.email = null;
    return admin;
};

describe('AdminIntegrationTests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
    });

    describe('Add', () => {
        beforeEach((done) => {
            integrationTestHelpers.createBranch().nodeify(done);
        });

        it('should return 200 and a created admin user when the input is valid', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createUser)
            .tap(integrationTestHelpers.authenticateOrganiser(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .send(makeAdminUser(branch))
                    .expect(200)
                    .then(hasNewAdmin);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createUser)
            .tap(integrationTestHelpers.authenticateOrganiser(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createUser)
            .tap(integrationTestHelpers.authenticateOrganiser(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeInvalidUser(branch))
                    .expect(400);
            })
            .then(done, done.fail);
        });
    });

    describe('delete admin', () => {
        it('should return a 200 when the admin is successfully deleted', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.authenticateOrganiser(agent))
                .then((adminUser) => {
                    return agent.delete(`/branches/${adminUser.dataValues.branchId}/admins/${adminUser.dataValues.id}`)
                    .expect(200);
                })
                .then(done, done.fail);
        });

        it('should return a 400 if the input data is not valid', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.authenticateOrganiser(agent))
                .then((adminUser) => {
                    return agent.delete(`/branches/${adminUser.dataValues.branchId}/admins/whatevs`)
                    .expect(400);
                })
                .then(done, done.fail);
        });

        it('should return 500 when trying to delete a admin that does not exist', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.authenticateOrganiser(agent))
                .then((adminUser) => {
                    return agent.delete(`/branches/${adminUser.dataValues.branchId}/admins/${uuid.v4()}`)
                    .expect(500);
                })
                .then(done, done.fail);
        });
    });
});
