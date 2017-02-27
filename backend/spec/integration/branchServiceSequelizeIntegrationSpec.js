'use strict';

const integrationTestHelpers = require('./integrationTestHelpers.js');
const branchService = require('../../src/services/branchService');

describe('branchServiceSequelizeIntegration', () => {
  describe('groupsInBranch', () => {
    it('should return the branches groups if it has some', () => (
      integrationTestHelpers.createBranch()
        .tap(branch => integrationTestHelpers.createGroupInBranch(branch.id))
        .then(branch => branchService.groupsInBranch(branch.id))
        .then(result => {
          expect(result.length).to.equal(1);
        })
    ));

    it('should return no groups if the branch has none', () => (
      integrationTestHelpers.createBranch()
        .then(branch => branchService.groupsInBranch(branch.id))
        .then(result => {
          expect(result.length).to.equal(0);
        })
    ));

    describe('sad scenarios', () => {
      it('should handle an invalid branchId', () => (
        integrationTestHelpers.createBranch()
          .then(() => branchService.groupsInBranch('invalidId'))
          .then(
            () => { throw new Error('This should not have succeded'); },
            error => {
              expect(error.message).to.equal('Error when looking up groups in branch with id: invalidId');
            }
          )
      ));
    });
  });
});
