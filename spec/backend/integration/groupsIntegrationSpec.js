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
                _.sample(response.body.members),
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
                .tap(integrationTestHelpers.createFakeMembers(agent, 1))
                .then((branch) => {
                    return integrationTestHelpers.createGroupInBranch(branch.id);
                })
                .tap(integrationTestHelpers.authenticate(agent))
                .then(getMemberAndReturnMemberAndGroup)
                .spread((member, group) => {
                    let branchId = member.branchId;
                    return agent.post(`/branches/${branchId}/groups/${group.id}/members`)
                        .set('Content-Type', 'application/json')
                        .send([member.id])
                        .expect(200);
                })
                .then(done, done.fail);
        });
    });
});
