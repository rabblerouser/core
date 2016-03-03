'use strict';
const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');
let request = require('supertest-as-promised');
const sample = require('lodash').sample;
let integrationTestHelpers = require('./integrationTestHelpers.js');

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

describe('MemberIntegrationTests', () => {
    let agent;

    beforeEach((done) => {
        agent = request.agent(app);
        integrationTestHelpers.createBranch().nodeify(done);
    });

    describe('Creating new member', () => {
        it('should return 200 and a created member when the input is valid', (done) => {
            getBranchId(agent)
            .then((branchId) => {
                return agent
                .post('/members')
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
                .post('/members')
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
                .post('/members')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(makeMemberWithNoAddress(branchId))
                .expect(200)
                .expect(hasNewMember);
            }).then(done, done.fail);
        });

        it('should return 400 if the input is null', (done) => {
            return agent
            .post('/members')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(null)
            .expect(400)
            .then(done, done.fail);
        });

        it('should return 400 if the input is incomplete', (done) => {
            return agent
            .post('/members')
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
            .tap(integrationTestHelpers.createUser)
            .then(integrationTestHelpers.createFakeMembers(agent, 3))
            .then(integrationTestHelpers.authenticate(agent))
            .then(() => {
                return agent.get('/members');
            })
            .then(hasMembersList)
            .then(done, done.fail);
        });

        it('only authenticated organisers can access the members list', (done) => {

            integrationTestHelpers.createBranch()
            .then(integrationTestHelpers.createFakeMembers(agent, 3))
            .then(() => {
                return agent.get('/members');
            })
            .then((res) => {
                expect(res.headers.location).toEqual('/login');
                expect(res.status).toEqual(302);
            })
            .then(done, done.fail);
        });
    });
});
