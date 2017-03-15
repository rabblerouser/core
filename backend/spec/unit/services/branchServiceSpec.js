'use strict';

const Q = require('q');
const models = require('../../../src/models');

const Branch = models.Branch;

const branchService = require('../../../src/services/branchService');

describe('branchService', () => {
  describe('findById', () => {
    let findOnePromise;

    beforeEach(() => {
      findOnePromise = Q.defer();
      sinon.stub(Branch, 'findById').returns(findOnePromise.promise);
    });

    afterEach(() => {
      Branch.findById.restore();
    });

    it('should return the branch associated with that id', done => {
      const branchFromDb = { dataValues: { id: 'some-id-1', name: 'Ngamarriyanga (NT)' } };
      findOnePromise.resolve(branchFromDb);

      branchService.findById('some-id-1')
            .then(result => {
              expect(Branch.findById).to.have.been.called;
              expect(result.id).to.equal('some-id-1');
              expect(result.name).to.equal('Ngamarriyanga (NT)');
            })
            .then(done)
            .catch(done);
    });

    it('should return an empty object when id is null', done => {
      branchService.findById(null)
            .then(result => {
              expect(Branch.findById).not.to.have.been.called;
              expect(result).to.eql({});
            })
            .then(done)
            .catch(done);
    });

    it('should return an empty object when the branch is not found', done => {
      findOnePromise.resolve(null);

      branchService.findById('some-id-1')
            .then(result => {
              expect(Branch.findById).to.have.been.called;
              expect(result).to.eql({});
            })
            .then(done)
            .catch(done);
    });

    describe('sad scenario', () => {
      it('should handle errors when retrieving the branches list', done => {
        findOnePromise.reject('some db error the service should not rethrow');

        branchService.findById('some-id-1')
                .then(() => {
                  done.fail('This should not have succeded');
                })
                .catch(error => {
                  expect(Branch.findById).to.have.been.called;
                  expect(error.message).to.equal('Error when looking up branch with id: some-id-1');
                })
                .then(done)
                .catch(done);
      });
    });
  });
});
