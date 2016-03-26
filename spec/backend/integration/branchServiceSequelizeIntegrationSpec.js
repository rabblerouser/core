'use strict';
const integrationTestHelpers = require('./integrationTestHelpers.js');
var branchService = require('../../../src/backend/services/branchService');

describe('branchServiceSequelizeIntegration', () => {

    describe('groupsInBranch', () => {

        it('should return the branches groups if it has some', (done) => {
            integrationTestHelpers.createBranch()
            .tap((branch) => integrationTestHelpers.createGroupInBranch(branch.id))
            .then((branch) => branchService.groupsInBranch(branch.id))
            .then((result) => {
                expect(result.length).toEqual(1);
            }).then(done, done.fail);
        });

        it('should return no groups if the branch has none', (done) => {
            integrationTestHelpers.createBranch()
            .then((branch) => branchService.groupsInBranch(branch.id))
            .then((result) => {
                expect(result.length).toEqual(0);
            }).then(done, done.fail);
        });

        describe('sad scenarios', () => {
            it('should handle an invalid branchId', (done) => {
                integrationTestHelpers.createBranch()
                .then(() => branchService.groupsInBranch('invalidId'))
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(error.message).toEqual('Error when looking up groups in branch with id: invalidId');
                }).then(done, done.fail);
            });
        });
    });
});
