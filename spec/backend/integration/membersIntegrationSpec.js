'use strict';

const instance_url = process.env.INSTANCE_URL;
let app = instance_url ? instance_url : require('../../../src/backend/app');
let request = require('supertest-as-promised');
const sample = require('lodash').sample;
const times = require('lodash').times;
let models = require('../../../src/backend/models'),
    Branch = models.Branch,
    AdminUser = models.AdminUser;

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

let getBranchKey = (someAgent) => {
    return someAgent
            .get('/branches')
            .then((response) => {
                return sample(response.body.branches).key;
            });
};

let makeMember = (branchKey) => {
    return {
        'contactFirstName': 'Jaime',
        'contactLastName': 'Garzon',
        'schoolType': 'Primary',
        'branch': branchKey,
        'firstName': 'Sherlock',
        'lastName': 'Holmes',
        'email': 'sherlock@holmes.co.uk',
        'dateOfBirth': '01/01/1983',
        'primaryPhoneNumber': '0396291146',
        'secondaryPhoneNumber': null,
        'gender': 'horse radish',
        'residentialAddress': {
            'address': '222b Baker St',
            'suburb': 'London',
            'country': 'England',
            'state': 'VIC',
            'postcode': '1234'
        },
        'postalAddress': {
            'address': '303 collins st',
            'suburb': 'melbourne',
            'country': 'australia',
            'state': 'VIC',
            'postcode': '3000'
        },
        'membershipType': 'full'
    };
};

function createFakeMembers(agent, numberOfMembers) {
    return function(branch) {
        let createTheseMembers = [];
        times(numberOfMembers, () => {
            createTheseMembers.push(agent
                .post('/members')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(makeMember(branch.key))
            );
        });
        return Promise.all(createTheseMembers);
    };
}


let makeMemberWithNoAddress = (branchKey) => {
    let member = makeMember(branchKey);
    member.residentialAddress = null;
    member.postalAddress = null;

    return member;
};

let makeInvalidMember = () => {
    let member = makeMember();
    member.firstName = null;
    return member;
};

function createBranch() {
    return Branch.create({name:'Fake Branch'})
    .then((sequelizeResult) => {
        return sequelizeResult.dataValues;
    });
}

function createUser(branch) {
    return AdminUser.create({ email: 'orgnsr@thelab.org', password: 'organiser', branchId: branch.id });
}

function authenticate(someAgent) {
    return function() {
        return someAgent
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'orgnsr@thelab.org', password: 'organiser' })
        .expect(302);
    };
}

describe('MemberIntegrationTests', () => {
    let agent;

    beforeEach(() => {

        agent = request.agent(app);
    });

    describe('Creating new member', () => {
        it('should return 200 and a created member when the input is valid', (done) => {
            getBranchKey(agent)
            .then((branchKey) => {
                return agent
                .post('/members')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(makeMember(branchKey))
                .expect(200)
                .expect(hasNewMember);
            }).then(done, done.fail);
        });

        it('should return 200 when creating a member with no address', (done) => {
            getBranchKey(agent)
            .then((branchKey) => {
                return agent
                .post('/members')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(makeMemberWithNoAddress(branchKey))
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
            createBranch()
            .tap(createUser)
            .then(createFakeMembers(agent, 3))
            .then(authenticate(agent))
            .then(() => {
                return agent.get('/members');
            })
            .then(hasMembersList)
            .then(done, done.fail);
        });
    });
});
