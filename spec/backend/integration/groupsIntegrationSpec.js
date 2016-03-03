'use strict';

let request = require('supertest-as-promised'),
    _ = require('lodash'),
    integrationTestHelpers = require('./integrationTestHelpers'),
    app, agent;

const instance_url = process.env.INSTANCE_URL;

require('../../support/specHelper');

let listOfGroups = (res) => {
    if (!('groups' in res.body)) {
        throw new Error('groups not found');
    }
};

let getGroups = () => {
    return request(app)
        .get('/groups')
        .expect(200)
        .expect(listOfGroups);
};

function getMemberAndReturnMemberAndGroup(group) {
    return agent.get('/members')
        .then((response) => {
            return [
                response.body.members,
                group
            ];
        });
}

describe('Groups Integration Test', () => {
    beforeEach(() => {
        app = instance_url ? instance_url : require('../../../src/backend/app');
        agent = request.agent(app);
    });

    it('should return a list of groups', (done) => {
        getGroups()
            .then(done, done.fail);
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
                .then(getMemberAndReturnMemberAndGroup)
                .spread((members, group) => {
                    let branchId = _.sample(members).branchId;
                    let memberIds = _.pluck(members, 'id');

                    return agent.post(`/branches/${branchId}/groups/${group.id}/members`)
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
                .then((group) => {
                    let branchId = group.branchId;

                    return agent.post(`/branches/${branchId}/groups/${group.id}/members`)
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
                .then((group) => {
                    let badBranchId = 1234;
                    let badMemberIds = [1, 2];

                    return agent.post(`/branches/${badBranchId}/groups/${group.id}/members`)
                        .set('Content-Type', 'application/json')
                        .send({memberIds: badMemberIds})
                        .expect(500)
                        .expect((res) => {
                            if (_.isEmpty(res.body)) {
                                return;
                            } else {
                                throw new Error("response body should be empty");
                            }
                        });
                })
                .then(done, done.fail);
        });
    });
});
