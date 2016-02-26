'use strict';

let request = require('supertest-as-promised');
const instance_url = process.env.INSTANCE_URL;
let app;

let hasNewMember = (res) => {
    if (!('newMember' in res.body)) {
        throw new Error('missing created member');
    }
};

let makeMember = () => {
    return {
        'contactName': 'Rebeca',
        'schoolType': 'Primary',
        'labSelection': 'lab-geelong',
        'firstName': 'Sherlock',
        'lastName': 'Holmes',
        'email': 'sherlock@holmes.co.uk',
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

describe('User Flow', () => {

    beforeEach(() => {
        app = instance_url ? instance_url : require('../../../src/backend/app');
    });

    xit ('member sign up with duplicate email should not fail', (done) => {
        successfullyCreatingANewMemberShouldRepondWithA200(makeMember())
        .then(done, done.fail);
    }, 60000);
});
