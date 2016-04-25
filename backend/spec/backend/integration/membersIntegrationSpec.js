'use strict';

const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/app');
let request = require('supertest-as-promised');
const sample = require('lodash').sample;
const pluck = require('lodash').pluck;
let integrationTestHelpers = require('./integrationTestHelpers.js');
let Q = require('../../support/specHelper').Q;

function getMembers(someAgent, state) {
    return function() {
        return someAgent.get(`/branches/${state.branch.id}/members`)
        .then((response) => {
            return response.body.members;
        });
    };
}

function editMember(member, groups) {
    groups = groups || [];
    return Object.assign({}, member, {dateOfBirth: '01/01/1986', groups: groups, branch: member.branchId});
}

let hasNewMember = (res) => {
    if (!('newMember' in res.body)) {
        throw new Error('missing created member');
    }
};

function hasMembersList(res) {
    let response = res.body;
    expect(response.members).not.toBeNull();
    expect(response.members.length).toEqual(3);
}

let getBranchId = (someAgent) => {
    return someAgent
            .get('/branches')
            .then((response) => {
                return sample(response.body.branches).id;
            });
};

let makeMemberWithNoAddress = (branchId) => {
    let member = integrationTestHelpers.makeMember(branchId);
    member.residentialAddress = null;
    member.postalAddress = null;

    return member;
};

let makeInvalidMember = () => {
    let member = integrationTestHelpers.makeMember();
    member.firstName = null;
    return member;
};

function setState(obj, key) {
    return function (newState) {
        obj[key] = newState;
    };
}

describe('MemberIntegrationTests', () => {
    let agent;

    beforeEach(() => {
        agent = request.agent(app);
    });

    describe('Register', () => {
        beforeEach((done) => {
            integrationTestHelpers.createBranch().nodeify(done);
        });

        it('should return 200 and a created member when the input is valid', (done) => {
            getBranchId(agent)
            .then((branchId) => {
                return agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(integrationTestHelpers.makeMember(branchId))
                .expect(200)
                .expect(hasNewMember);
            }).then(done, done.fail);
        });

        it('should safely create a member with dodgy information', (done) => {
            getBranchId(agent)
            .then((branchId) => {
                let dodgyMember = integrationTestHelpers.makeMember(branchId);
                dodgyMember.additionalInfo = '\'); DROP TABLE MEMBERS';

                return agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(dodgyMember)
                .expect(200)
                .expect(hasNewMember);
            }).then(done, done.fail);
        });

        it('should return 200 when creating a member with no address', (done) => {
            getBranchId(agent)
            .then((branchId) => {
                return agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(makeMemberWithNoAddress(branchId))
                .expect(200)
                .expect(hasNewMember);
            }).then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            return agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(null)
            .expect(400)
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            return agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(makeInvalidMember())
            .expect(400)
            .then(done, done.fail);
        });
    });

    describe('list of members', () => {
        it('finds a list of members for an organiser', (done) => {
            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((branch) => {
                return agent.get(`/branches/${branch.id}/members`);
            })
            .then(hasMembersList)
            .then(done, done.fail);
        });

        it('only authenticated organisers can access the members list', (done) => {

            integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .then((branch) => {
                return agent.get(`/branches/${branch.id}/members`);
            })
            .then((res) => {
                expect(res.status).toEqual(302);
            })
            .then(done, done.fail);
        });
    });

    describe('Edit member', () => {

        let browserState = {};

        beforeEach((done) => {
            integrationTestHelpers.createBranch()
            .tap(setState(browserState, 'branch'))
            .tap(integrationTestHelpers.createBranchAdmin)
            .then(integrationTestHelpers.createMembers(agent, 1))
            .then(() => {
                return Q.all([
                    integrationTestHelpers.createGroupInBranch(browserState.branch.id),
                    integrationTestHelpers.createGroupInBranch(browserState.branch.id)
                ]);
            })
            .tap(setState(browserState, 'groups'))
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then(getMembers(agent, browserState))
            .tap(setState(browserState, 'members'))
            .then(done, done.fail);
        });

        it('should add groups to a member', (done) => {
            let member = sample(browserState.members);
            let groups = pluck(browserState.groups, 'groupId');
            let branchId = browserState.branch.id;

            return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, groups))
                .expect(200)
                .expect((res) => {
                    let response = res.body;
                    expect(response.groups).not.toBeNull();
                    expect(response.groups.length).toEqual(2);
                })
                .then(done, done.fail);
        });

        it('should edit the member with the new values', (done) => {
            let member = sample(browserState.members);
            let branchId = browserState.branch.id;

            member.firstName = 'Super Test';

            return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(200)
                .then((response) => {
                    let member = response.body;
                    expect(member.firstName).toEqual('Super Test');
                })
                .then(done, done.fail);
        });

        it('should respond 400 if invalid input', (done) => {
            let member = sample(browserState.members);
            let branchId = browserState.branch.id;

            member.firstName = null;

            return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(400)
                .then(done, done.fail);
        });
    });
});
