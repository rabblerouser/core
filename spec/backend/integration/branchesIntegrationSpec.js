'use strict';
require('../../support/specHelper');
const integrationTestHelpers = require('./integrationTestHelpers.js');
const sample = require('lodash').sample;
let uuid = require('node-uuid');

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

    beforeEach(() => {
        agent = request.agent(app);
    });

    it('should return a list of branches', (done) => {
        getBranches()
            .then(done, done.fail);
    }, 60000);

    it('should return a list of groups for a branch', (done) => {
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
                    expect(sample(res.body.r));
                });
        })
        .then(done, done.fail);
    });

    it('should return branches notes for super admins', (done) => {
        integrationTestHelpers.createBranch()
        .tap(integrationTestHelpers.createSuperAdmin)
        .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
        .then(() => {
            return agent.get('/admin/branches')
                .expect(200)
                .then((res) => {
                    expect(res.body.branches).not.toBeNull();
                    expect(sample(res.body.branches).notes).not.toBeNull();
                });
        })
        .then(done, done.fail);
    });

    it('should not return branches notes for branch admins', (done) => {
        integrationTestHelpers.createBranch()
        .tap(integrationTestHelpers.createUser)
        .tap(integrationTestHelpers.authenticateOrganiser(agent))
        .then(() => {
            return agent.get('/admin/branches')
                .expect(200)
                .then((res) => {
                    expect(res.body.branches).not.toBeNull();
                    expect(sample(res.body.branches).notes).toBeUndefined();
                });
        })
        .then(done, done.fail);
    });

    describe('delete', () => {
        it('should return a 200 when the branch is successfully deleted', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createSuperAdmin)
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then((branch) => {
                    return agent.delete(`/branches/${branch.id}/`)
                    .expect(200);
                })
                .then(done, done.fail);
        });

        it('should return a 400 if the input data is not valid', (done) => {
            integrationTestHelpers.createBranch()
                .then(integrationTestHelpers.createUser)
                .tap(integrationTestHelpers.createSuperAdmin)
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.delete(`/branches/whatevs/`)
                    .expect(400);
                })
                .then(done, done.fail);
        });

        it('should return 500 when trying to delete a branch that does not exist', (done) => {
            integrationTestHelpers.createBranch()
                .tap(integrationTestHelpers.createSuperAdmin)
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.delete(`/branches/${uuid.v4()}/`)
                    .expect(500);
                })
                .then(done, done.fail);
        });
    });

    describe('add', () => {

        it('should return 200 and a created branch when the input is valid', (done) => {
            integrationTestHelpers.createSuperAdmin()
                .then(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.post(`/branches`)
                        .set('Content-Type', 'application/json')
                        .send(makeBranch())
                        .expect(200)
                        .then(getBranches);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            integrationTestHelpers.createSuperAdmin()
                .then(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.post(`/branches`)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send(null)
                        .expect(400);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => {
                    return agent.post(`/branches`)
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send({invalid:'invalid'})
                        .expect(400);
            })
            .then(done, done.fail);
        });
    });

    describe('update', () => {
        it('should return 200 and an updated branch when the input is valid', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then((branch) => {
                return agent.put(`/branches/${branch.id}/`)
                    .set('Content-Type', 'application/json')
                    .send(makeBranchUpdates(branch))
                    .expect(200)
                    .then(hasBranch);
            })
            .then(done, done.fail);
        });

        it('should allow update without the password field in the payload', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then((branch) => {
                return agent.put(`/branches/${branch.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeBranchUpdates(branch))
                    .expect(200)
                    .then(hasBranch);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then((branch) => {
                return agent.put(`/branches/${branch.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400);
            })
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createSuperAdmin)
            .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
            .then(() => {
                return agent.put(`/branches/whatevs`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({invalid: 'invalid'})
                    .expect(400);
            })
            .then(done, done.fail);
        });

    });
});
