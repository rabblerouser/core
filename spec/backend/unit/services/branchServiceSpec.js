'use strict';

const specHelper = require('../../../support/specHelper'),
      Q = specHelper.Q,
      sinon = specHelper.sinon,
      Branch = specHelper.models.Branch;

var branchService = require('../../../../src/backend/services/branchService');

function fakeBranchesListFromDb() {
    return [
        {
            dataValues: {
                key:'some-key-1',
                name: 'Geelong'
            }
        },
        {
            dataValues: {
                key:'some-key-2',
                name: 'Frankston'
            }
        },
        {
            dataValues: {
                key:'some-key-3',
                name: 'Hawthorn'
            }
        }
    ];
}

describe('branchService', () => {
    describe('list', () => {

        beforeEach(() => {
            sinon.stub(Branch, 'findAll');
        });

        afterEach(() => {
            Branch.findAll.restore();
        });

        it('should return all available branches', (done) => {
            Branch.findAll
                .returns(Promise.resolve(fakeBranchesListFromDb()));

            branchService.list().then((result) => {
                expect(result.length).toEqual(3);
                expect(result[0].key).toEqual('some-key-1');
                expect(result[0].name).toEqual('Geelong');
            }).then(done, done.fail);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the branches list', (done) => {
                Branch.findAll.returns(Promise.reject('Obscure DB error the service should not rethrow'));

                 branchService.list()
                .then(() => {
                    jasmine.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Branch.findAll).toHaveBeenCalled();
                    expect(error.message).toEqual('An error has occurred while fetching branches');
                })
                .then(done, done.fail);
            });
        });
    });

    describe('findByKey', () => {
        let findOneStub;
        let findOnePromise;

        beforeEach(() => {
            findOnePromise = Q.defer();
            findOneStub = sinon.stub(Branch, 'findOne').returns(findOnePromise.promise);
        });

        afterEach(() => {
            Branch.findOne.restore();
        });

        it('should return the branch associated with that key', (done) => {
            let branchFromDb = {dataValues: {key: 'some-key-1', id: 'some-id-1', name: 'Ngamarriyanga (NT)'}};
            findOnePromise.resolve(branchFromDb);

            branchService.findByKey('some-key-1')
            .then((result) => {
                expect(Branch.findOne).toHaveBeenCalled();
                expect(result.id).toEqual('some-id-1');
                expect(result.name).toEqual('Ngamarriyanga (NT)');
            })
            .then(done, done.fail);
        });

        it('should return an empty object when key is null', (done) => {
            branchService.findByKey(null)
            .then((result) => {
                expect(Branch.findOne).not.toHaveBeenCalled();
                expect(result).toEqual({});
            })
            .then(done, done.fail);
        });

        it('should return an empty object when the branch is not found', (done) => {
            findOnePromise.resolve(null);

            branchService.findByKey('some-key-1')
            .then((result) => {
                expect(Branch.findOne).toHaveBeenCalled();
                expect(result).toEqual({});
            })
            .then(done, done.fail);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the branches list', (done) => {
                findOnePromise.reject('some db error the service should not rethrow');

                branchService.findByKey('some-key-1')
                .then(() => {
                    jasmine.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Branch.findOne).toHaveBeenCalled();
                    expect(error.message).toEqual('Error when looking up branch with key: some-key-1');
                })
                .then(done, done.fail);
            });
        });
    });

});
