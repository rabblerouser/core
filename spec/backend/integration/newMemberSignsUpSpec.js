'use strict';

var request = require('supertest-as-promised');

const instance_url = process.env.INSTANCE_URL;

describe('User Flow', () => {
    let app,
        memberSuffix,
        member;

    let hasNewMember = (res) => {
        if (!('newMember' in res.body)) {
            throw new Error('missing created member');
        }
    };

    let successfullyCreatingANewMemberShouldRepondWithA200 = () => {
        return request(app)
            .post('/members')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(member)
            .expect(200)
            .expect(hasNewMember);
    };

    let postMemberWithExistEmailShouldRespondWithA200 = () => {
        return request(app)
            .post('/members')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(member)
            .expect(200);
    };

    let makeMemberWithEmail = email => {
        return {
            'firstName': 'Sherlock',
            'lastName': 'Holmes',
            'email': email,
            'dateOfBirth': '22/12/1900',
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

    beforeEach(() => {
        if (instance_url) {
            app = instance_url;
            memberSuffix = Date.now();
        }
        else {
            app = require('../../../src/backend/app');
            memberSuffix = '';
        }

        let email = `sherlock${memberSuffix}@holmes.co.uk`;

        member = makeMemberWithEmail(email);
    });

    it ('member sign up with duplicate email should not fail', (done) => {
        successfullyCreatingANewMemberShouldRepondWithA200()
            .then(postMemberWithExistEmailShouldRespondWithA200)
            .then(done, done.fail);
    }, 60000);
});
