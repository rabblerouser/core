'use strict';

let request = require('supertest-as-promised');
const instance_url = process.env.INSTANCE_URL;
let app;

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
    });

    it('should return a list of groups', (done) => {
        getGroups()
        .then(done, done.fail);
    }, 60000);
});
