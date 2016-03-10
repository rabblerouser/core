'use strict';

let request = require('supertest-as-promised'),
    _ = require('lodash'),
    integrationTestHelpers = require('./integrationTestHelpers'),
    agent;
let uuid = require('node-uuid');

const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');

require('../../support/specHelper');

function getMemberAndReturnMemberAndGroup(someAgent) {
    return function(branchGroup) {
        return someAgent.get(`/branches/${branchGroup.branchId}/members`)
            .then((response) => {
                return [
                    response.body.members,
                    branchGroup
                ];
            });
    };
}

function makeGroup() {
    return {
        name: 'Waiting List',
        description: 'This is a description of the waiting list'
    };
}

function assertCreatedGroup(res) {
    let response = res.body;
    expect(response).not.toBeNull();
    expect(response.id).not.toBeNull();
    expect(response.name).toEqual('Waiting List');
}

describe('Groups Integration Test', () => {
    beforeEach(() => {
        agent = request.agent(app);
    });

    describe('create group for a branch', () => {
        it('should return 200 when the group is successfully created', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createUser)
            .tap(integrationTestHelpers.authenticate(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/groups`)
                    .set('Content-Type', 'application/json')
                    .send(makeGroup())
                    .expect(200)
                    .then(assertCreatedGroup);
            })
            .then(done, done.fail);
        });

        it('should return 400 if group input data is not valid', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createUser)
            .tap(integrationTestHelpers.authenticate(agent))
            .then((branch) => {
                return agent.post(`/branches/${branch.id}/groups`)
                    .set('Content-Type', 'application/json')
                    .send({})
                    .expect(400);
            })
            .then(done, done.fail);
        });
    });

    describe('delete group', () => {
        it('should return a 200 when the group is successfully deleted', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createUser)
                .then((branch) => {
                    return integrationTestHelpers.createGroupInBranch(branch.id);
                })
                .tap(integrationTestHelpers.authenticate(agent))
                .then((branchGroup) => {
                    return agent.delete(`/branches/${branchGroup.branchId}/groups/${branchGroup.groupId}`)
                    .expect(200);
                })
                .then(done, done.fail);
        });

        it('should return a 400 if the input data is not valid', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.authenticate(agent))
                .then((branch) => {
                    return agent.delete(`/branches/${branch.id}/groups/whatevs`)
                    .expect(400);
                })
                .then(done, done.fail);
        });

        /*This should return a different code, but requires more work, so will address later*/
        it('should return 500 when trying to delete a group that does not exist', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.authenticate(agent))
                .then((branch) => {
                    return agent.delete(`/branches/${branch.id}/groups/${uuid.v4()}`)
                    .expect(500);
                })
                .then(done, done.fail);
        });
    });

    describe('adding a member to a group', () => {
        it('responds with a 200', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.createFakeMembers(agent, 2))
                .then((branch) => {
                    return integrationTestHelpers.createGroupInBranch(branch.id);
                })
                .tap(integrationTestHelpers.authenticate(agent))
                .then(getMemberAndReturnMemberAndGroup(agent))
                .spread((members, branchGroup) => {
                    let branchId = branchGroup.branchId;
                    let memberIds = _.pluck(members, 'id');

                    return agent.post(`/branches/${branchId}/groups/${branchGroup.groupId}/members`)
                        .set('Content-Type', 'application/json')
                        .send({memberIds: memberIds})
                        .expect(200);
                })
                .then(done, done.fail);
        });

        it('responds with a 400 when members is empty', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.createFakeMembers(agent, 2))
                .then((branch) => {
                    return integrationTestHelpers.createGroupInBranch(branch.id);
                })
                .tap(integrationTestHelpers.authenticate(agent))
                .then((branchGroup) => {
                    let branchId = branchGroup.branchId;

                    return agent.post(`/branches/${branchId}/groups/${branchGroup.id}/members`)
                        .set('Content-Type', 'application/json')
                        .send({memberIds: []})
                        .expect(400);
                })
                .then(done, done.fail);
        });

        it('responds with a 500 and an empty body when there is an error', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.createFakeMembers(agent, 2))
                .then((branch) => {
                    return integrationTestHelpers.createGroupInBranch(branch.id);
                })
                .tap(integrationTestHelpers.authenticate(agent))
                .then((branchGroup) => {
                    let badMemberIds = [1, 2];

                    return agent.post(`/branches/${branchGroup.branchId}/groups/${branchGroup.id}/members`)
                        .set('Content-Type', 'application/json')
                        .send({memberIds: badMemberIds})
                        .expect(500)
                        .expect((res) => {
                            if (_.isEmpty(res.body)) {
                                return;
                            } else {
                                throw new Error('response body should be empty');
                            }
                        });
                })
                .then(done, done.fail);
        });
    });
});
