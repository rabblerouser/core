'use strict';

let request = require('supertest-as-promised');
const instance_url = process.env.INSTANCE_URL;
let app;

let listOfBranches = (res) => {
    if (!('branches' in res.body)) {
        throw new Error('branches not found');
    }
};

let getBranches = () => {
    return request(app)
        .get('/branches')
        .expect(200)
        .expect(listOfBranches);
};

describe('Branches Integration Test', () => {

    beforeEach(() => {
        app = instance_url ? instance_url : require('../../../src/backend/app');
    });

    it('should return a list of branches', (done) => {
        getBranches()
        .then(done, done.fail);
    }, 60000);
});
