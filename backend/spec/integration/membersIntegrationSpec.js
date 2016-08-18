'use strict';

const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../src/app');
let request = require('supertest-as-promised');
const sample = require('lodash').sample;
const pluck = require('lodash').pluck;
let integrationTestHelpers = require('./integrationTestHelpers.js');
let Q = require('q');

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
    return Object.assign({}, member, { groups: groups, branch: member.branchId });
}

let hasNewMember = (res) => {
    if (!('newMember' in res.body)) {
        throw new Error('missing created member');
    }
};

function hasMembersList(res) {
    let response = res.body;
    expect(response.members).not.to.be.null;
    expect(response.members.length).to.equal(3);
}

let getBranchId = (someAgent) => {
    return function() {
        return someAgent
        .get('/branches')
        .then((response) => {
            return sample(response.body.branches).id;
        });
    };
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
    let browserState = {};

    beforeEach(() => {
        agent = request.agent(app);
    });

    describe('Register', () => {
        beforeEach(() => {
            return integrationTestHelpers.resetDatabase()
            .then(integrationTestHelpers.createBranch)
            .then(getBranchId(agent))
            .then((branchId) => browserState.branchId = branchId);
        });

        it('should return 200 and a created member when the input is valid', () => {
            return agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(integrationTestHelpers.makeMember(browserState.branchId))
                .expect(200)
                .expect(hasNewMember);
        });

        it('should safely create a member with dodgy information', () => {
            let dodgyMember = integrationTestHelpers.makeMember(browserState.branchId);
            dodgyMember.additionalInfo = '\'); DROP TABLE MEMBERS';

            return agent
                .post('/register')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(dodgyMember)
                .expect(200)
                .expect(hasNewMember);
        });

        it('should return 200 when creating a member with no address', () => {
            return agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(makeMemberWithNoAddress(browserState.branchId))
            .expect(200)
            .expect(hasNewMember);
        });

        it('should return 400 if the input is null', () => {
            return agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(null)
            .expect(400);
        });

        it('should return 400 if the input is incomplete', () => {
            return agent
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(makeInvalidMember())
            .expect(400);
        });
    });

    describe('list of members', () => {
        it('finds a list of members for an organiser', () => {
            return integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createBranchAdmin)
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .tap(integrationTestHelpers.authenticateBranchAdmin(agent))
            .then((branch) => {
                return agent.get(`/branches/${branch.id}/members`);
            })
            .then(hasMembersList);
        });

        it('only authenticated organisers can access the members list', () => {
            return integrationTestHelpers.createBranch()
            .tap(integrationTestHelpers.createMembers(agent, 3))
            .then((branch) => {
                return agent.get(`/branches/${branch.id}/members`)
                .expect(302);
            });
        });
    });

    describe('Edit member', () => {
        beforeEach(() => {
            return integrationTestHelpers.resetDatabase()
            .then(integrationTestHelpers.createBranch)
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
            .tap(setState(browserState, 'members'));
        });

        it('should add groups to a member', () => {
            let member = sample(browserState.members);
            let groups = pluck(browserState.groups, 'groupId');
            let branchId = browserState.branch.id;

            return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, groups))
                .expect(200)
                .expect((res) => {
                    let response = res.body;
                    expect(response.groups).not.to.be.null;
                    expect(response.groups.length).to.equal(2);
                });
        });

        it('should edit the member with the new values', () => {
            let member = sample(browserState.members);
            let branchId = browserState.branch.id;

            member.firstName = 'Super Test';

            return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(200)
                .expect((response) => {
                    let member = response.body;
                    expect(member.firstName).to.equal('Super Test');
                });
        });

        it('should respond 400 if invalid input', () => {
            let member = sample(browserState.members);
            let branchId = browserState.branch.id;

            member.firstName = null;

            return agent.put(`/branches/${branchId}/members/${member.id}`)
                .set('Content-Type', 'application/json')
                .send(editMember(member, []))
                .expect(400);
        });
    });
});
