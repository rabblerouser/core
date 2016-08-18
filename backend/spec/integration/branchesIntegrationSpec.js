'use strict';
const integrationTestHelpers = require('./integrationTestHelpers.js');
const sample = require('lodash').sample;
let uuid = require('node-uuid');

let request = require('supertest-as-promised');
const instanceUrl = process.env.INSTANCE_URL;
let app = instanceUrl ? instanceUrl : require('../../src/app');

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

let makeBranch = () => {
    return {
        name: 'Melbourne',
        notes: 'organiser',
        contact: 'hey i\'m a contact',
    };
};

let makeBranchUpdates = (branch) => {
    branch.name = 'New Name!';
    return branch;
};

let hasBranch = (res) => {
    if (!(res.body.id)) {
        throw new Error('missing created branch');
    }
};

describe('Branches Integration Test', () => {

    let agent;
    let browserState = {};

    beforeEach(() => {
        agent = request.agent(app);

        return integrationTestHelpers.resetDatabase()
        .then(integrationTestHelpers.createBranch)
        .tap(integrationTestHelpers.createBranchAdmin)
        .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
        .then(branch => {
            browserState.branch = branch;
        });
    });

    afterEach(() => {
        browserState = {};
    });

    it('should return a list of branches', () => {
        return getBranches();
    });

    it('should return a list of groups for a branch', () => {
        return agent
            .get(`/branches/${browserState.branch.id}/groups`)
            .expect(200)
            .expect(listOfGroups);
    });

    it('should return a list of admins for a branch', () => {
        return agent
            .get(`/branches/${browserState.branch.id}/admins`)
            .expect(200)
            .expect(listOfAdmins);
    });

    it('should return the list of branches the admin user has access to', () => {
        return agent.get('/admin/branches')
            .expect(200)
            .then((res) => {
                expect(res.body.branches).not.to.be.null;
                expect(res.body.branches.length).to.equal(1);
                expect(res.body.branches[0].id).to.equal(browserState.branch.id);
            });
    });

    it('should return a list of all branches for a super admin', () => {
        return integrationTestHelpers.createBranch()
        .then(integrationTestHelpers.createBranch)
        .tap(integrationTestHelpers.createSuperAdmin)
        .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
        .then(() => {
            return agent.get('/admin/branches')
                .expect(200)
                .then((res) => {
                    expect(res.body.branches).not.to.be.null;
                    expect(res.body.branches.length).to.equal(3);
                    expect(sample(res.body.r));
                });
        });
    });

    it('should return branches notes for super admins', () => {
        return agent.get('/admin/branches')
            .expect(200)
            .then((res) => {
                expect(res.body.branches).not.to.be.null;
                expect(sample(res.body.branches).notes).not.to.be.null;
            });
    });

    it('should not return branches notes for branch admins', () => {
        return agent.get('/admin/branches')
            .expect(200)
            .then((res) => {
                expect(res.body.branches).not.to.be.null;
                expect(sample(res.body.branches).notes).to.be.undefined;
            });
    });

    describe('delete', () => {
        it('should return a 200 when the branch is successfully deleted', () => {
            return integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createSuperAdmin)
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then((branch) => {
                    return agent.delete(`/branches/${branch.id}/`)
                    .expect(200);
                });
        });

        it('should return a 400 if the input data is not valid', () => {
            return integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.delete(`/branches/whatevs/`)
                    .expect(400);
                });
        });

        it('should return 500 when trying to delete a branch that does not exist', () => {
            return integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createSuperAdmin)
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.delete(`/branches/${uuid.v4()}/`)
                    .expect(500);
                });
        });
    });

    describe('add', () => {

        it('should return 200 and a created branch when the input is valid', () => {
            return integrationTestHelpers.createSuperAdmin()
                .then(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.post(`/branches`)
                        .set('Content-Type', 'application/json')
                        .send(makeBranch())
                        .expect(200)
                        .expect(getBranches);
            });
        });

        it('should return 400 if the input is null', () => {
            return integrationTestHelpers.createSuperAdmin()
                .then(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.post(`/branches`)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send(null)
                        .expect(400);
            });
        });

        it('should return 400 if the input is incomplete', () => {
            return integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.post(`/branches`)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send({invalid:'invalid'})
                        .expect(400);
            });
        });
    });

    describe('update', () => {
        it('should return 200 and an updated branch when the input is valid', () => {
            return integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then((branch) => {
                return agent.put(`/branches/${branch.id}/`)
                    .set('Content-Type', 'application/json')
                    .send(makeBranchUpdates(branch))
                    .expect(200)
                    .expect(hasBranch);
            });
        });

        it('should allow update without the password field in the payload', () => {
            return integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then((branch) => {
                return agent.put(`/branches/${branch.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeBranchUpdates(branch))
                    .expect(200)
                    .expect(hasBranch);
            });
        });

        it('should return 400 if the input is null', () => {
            return integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then((branch) => {
                return agent.put(`/branches/${branch.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400);
            });
        });

        it('should return 400 if the input is incomplete', () => {
            return integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then(() => {
                return agent.put(`/branches/whatevs`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({invalid: 'invalid'})
                    .expect(400);
            });
        });

    });
});
