'use strict';

let request = require('supertest-as-promised');
let _ = require('lodash');
const instance_url = process.env.INSTANCE_URL;
let app,
    agent;
let integrationTestHelpers = require('./integrationTestHelpers');

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

describe('Groups Integration Test', () => {

    beforeEach(() => {
        app = instance_url ? instance_url : require('../../../src/backend/app');
        agent = request.agent(app);
    });

    it('should return a list of groups', (done) => {
        getGroups()
        .then(done, done.fail);
    }, 60000);

    xdescribe('adding a member to a group', () => {
        it('responds with a 200', () => {
            let group, branch;
            integrationTestHelpers.createBranch()
                .tap((branch) => {
                    branch = branch;
                })
                .tap(integrationTestHelpers.createUser)
                .then(integrationTestHelpers.createFakeMembers(agent, 1))
                .then((branch) => {
                    return integrationTestHelpers.createGroup(branch.id)
                })
                .tap((group) => {
                    groupId = group.id;
                })
                .then(integrationTestHelpers.authenticate(agent))
                .then(() => {
                    return agent.get('/members');
                })
                .then((response) => {
                    let member = _.sample(response.body.members);
                    let branchId = member.branchId;
                    return agent.post(`/branches/${branchId}/group/${groupId}/members`)
                        .set('Content-Type', 'application/json')
                        .send([member.id])
                        .expect(200);
                })
                .then(done, done.fail);
        });
    });
});
