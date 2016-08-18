'use strict';

let request = require('supertest-as-promised');
let _ = require('lodash');
let integrationTestHelpers = require('./integrationTestHelpers');
let uuid = require('node-uuid');

const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../src/app');

function getMembersForGroup(someAgent, branchGroup) {
    return function() {
        return someAgent.get(`/branches/${branchGroup.branchId}/members`)
        .then((response) => {
            return  response.body.members;
        });
    };
}

function makeGroup() {
    return {
        name: 'Waiting List',
        description: 'This is a description of the waiting list'
    };
}

function hasGroup(res) {
    let response = res.body;

    if (!(response.id && response.name === 'Waiting List')) {
        throw new Error('created group failed');
    }
}

function addMembersToGroup(agent, branchGroup) {
    return function(members) {
        let branchId = branchGroup.branchId;
        let memberIds = _.pluck(members, 'id');

        return agent.post(`/branches/${branchId}/groups/${branchGroup.groupId}/members`)
            .set('Content-Type', 'application/json')
            .send({memberIds: memberIds})
            .expect(200);
    };
}

describe('Groups Integration Test', () => {
    let agent;
    let browserState = {};

    beforeEach(() => {
        agent = request.agent(app);

        return integrationTestHelpers.resetDatabase()
        .then(integrationTestHelpers.createBranch)
        .tap(integrationTestHelpers.createBranchAdmin)
        .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
        .then( branch => {
            browserState.branch = branch;
        });
    });

    describe('create group for a branch', () => {
        it('should return 200 when the group is successfully created', () => {
            return agent.post(`/branches/${browserState.branch.id}/groups`)
                .set('Content-Type', 'application/json')
                .send(makeGroup())
                .expect(200)
                .expect(hasGroup);
        });

        it('should return 400 if group input data is not valid', () => {
            return agent.post(`/branches/${browserState.branch.id}/groups`)
                .set('Content-Type', 'application/json')
                .send({})
                .expect(400);
        });
    });

    describe('update group', () => {
        it('should return a 200 when the group is successfully updated', () => {
            return integrationTestHelpers.createGroupInBranch(browserState.branch.id)
                .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
                .then((branchGroup) => {
                    return agent.put(`/branches/${branchGroup.branchId}/groups/${branchGroup.groupId}`)
                    .set('Content-Type', 'application/json')
                    .send(makeGroup())
                    .expect(200)
                    .expect(hasGroup);
                });
        });
    });

    describe('delete group', () => {
        beforeEach(() => {
            return integrationTestHelpers.createGroupInBranch(browserState.branch.id)
            .then((branchGroup) => browserState.branchGroup = branchGroup)
        });

        it('should return a 200 when the group is successfully deleted', () => {
            return agent.delete(`/branches/${browserState.branchGroup.branchId}/groups/${browserState.branchGroup.groupId}`)
                .expect(200);
        });

        it('should return a 200 when a group with members is deleted', () => {
            return integrationTestHelpers.createMembers(agent, 2)(browserState.branch)
                .then(getMembersForGroup(agent, browserState.branchGroup))
                .then(addMembersToGroup(agent, browserState.branchGroup))
                .then(() => {
                    return agent.delete(`/branches/${browserState.branchGroup.branchId}/groups/${browserState.branchGroup.groupId}`)
                    .expect(200);
                });
        });

        it('should return a 400 if the input data is not valid', () => {
            return agent.delete(`/branches/${browserState.branch.id}/groups/whatevs`)
                .expect(400);
        });

        /*This should return a different code, but requires more work, so will address later*/
        it('should return 500 when trying to delete a group that does not exist', () => {
            return agent.delete(`/branches/${browserState.branch.id}/groups/${uuid.v4()}`)
            .expect(500);
        });
    });

    describe('adding a member to a group', () => {
        beforeEach(() => {
            return integrationTestHelpers.createGroupInBranch(browserState.branch.id)
            .then((branchGroup) => browserState.branchGroup = branchGroup)
        });

        it('responds with a 200', () => {
            return integrationTestHelpers.createMembers(agent, 2)(browserState.branch)
                .then(getMembersForGroup(agent, browserState.branchGroup))
                .then( members => {
                    let branchId = browserState.branchGroup.branchId;
                    let memberIds = _.pluck(members, 'id');

                    return agent.post(`/branches/${branchId}/groups/${browserState.branchGroup.groupId}/members`)
                        .set('Content-Type', 'application/json')
                        .send({memberIds: memberIds})
                        .expect(200);
                });
        });

        it('responds with a 400 when members is empty', () => {
            return integrationTestHelpers.createMembers(agent, 2)(browserState.branch)
                .then((branchGroup) => {
                    let branchId = browserState.branchGroup.branchId;

                    return agent.post(`/branches/${branchId}/groups/${browserState.branchGroup.id}/members`)
                        .set('Content-Type', 'application/json')
                        .send({memberIds: []})
                        .expect(400);
                });
        });

        it('responds with a 500 and an empty body when there is an error', () => {
            return integrationTestHelpers.createMembers(agent, 2)(browserState.branch)
                .then(() => {
                    let badMemberIds = [1, 2];

                    return agent.post(`/branches/${browserState.branchGroup.branchId}/groups/${browserState.branchGroup.id}/members`)
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
                });
        });
    });
});
