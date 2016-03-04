'use strict';
const specHelper = require('../../support/specHelper'),
    Branch = specHelper.models.Branch,
    Group = specHelper.models.Group,
    integrationTestHelpers = require('./integrationTestHelpers.js'),
    Q = specHelper.Q;

let request = require('supertest-as-promised');
const instanceUrl = process.env.INSTANCE_URL;
let app;

function seed() {
    let branchWithGroups;
    return Branch.create({
            id: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174',
            name: 'Branch name groups'
        }).then(function(branch) {
            branchWithGroups = branch;
            return Group.create({
                name: 'Waiting List',
                description: 'This is a description of the waiting list'
            });
        })
        .then(function(group) {
            return branchWithGroups.addGroup(group);
        });
}

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

let getBranches = () => {
    return request(app)
        .get('/branches')
        .expect(200)
        .expect(listOfBranches);
};

let getGroupsForBranch = () => {
    const branchId = 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174';
    let agent = request.agent(app);

    return Q(integrationTestHelpers.createUser({id: branchId}))
    .tap(integrationTestHelpers.authenticate(agent))
    .then(() => {
        return agent
            .get(`/branches/${branchId}/groups`)
            .expect(200)
            .expect(listOfGroups);
    });
};

describe('Branches Integration Test', () => {

    beforeEach((done) => {
        app = instanceUrl ? instanceUrl : require('../../../src/backend/app');
        seed().nodeify(done);
    });

    it('should return a list of branches', (done) => {
        getBranches()
            .then(done, done.fail);
    }, 60000);

    it('should return a list of groups for a branch', (done) => {
        getGroupsForBranch()
            .then(done, done.fail);
    }, 60000);

    it('should return a list of branches for an admin user', (done) => {
        let agent = request.agent(app);

        integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createUser)
            .tap(integrationTestHelpers.authenticate(agent))
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

});
