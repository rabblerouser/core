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
                id:'some-id-1',
                name: 'Geelong'
            }
        },
        {
            dataValues: {
                id:'some-id-2',
                name: 'Frankston'
            }
        },
        {
            dataValues: {
                id:'some-id-3',
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
                expect(result[0].id).toEqual('some-id-1');
                expect(result[0].name).toEqual('Geelong');
            }).then(done, done.fail);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the branches list', (done) => {
                Branch.findAll.returns(Promise.reject('Obscure DB error the service should not rethrow'));

                 branchService.list()
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Branch.findAll).toHaveBeenCalled();
                    expect(error.message).toEqual('An error has occurred while fetching branches');
                })
                .then(done, done.fail);
            });
        });
    });

    describe('findById', () => {
        let findOneStub;
        let findOnePromise;

        beforeEach(() => {
            findOnePromise = Q.defer();
            findOneStub = sinon.stub(Branch, 'findById').returns(findOnePromise.promise);
        });

        afterEach(() => {
            Branch.findById.restore();
        });

        it('should return the branch associated with that id', (done) => {
            let branchFromDb = {dataValues: {id: 'some-id-1', name: 'Ngamarriyanga (NT)'}};
            findOnePromise.resolve(branchFromDb);

            branchService.findById('some-id-1')
            .then((result) => {
                expect(Branch.findById).toHaveBeenCalled();
                expect(result.id).toEqual('some-id-1');
                expect(result.name).toEqual('Ngamarriyanga (NT)');
            })
            .then(done, done.fail);
        });

        it('should return an empty object when id is null', (done) => {
            branchService.findById(null)
            .then((result) => {
                expect(Branch.findById).not.toHaveBeenCalled();
                expect(result).toEqual({});
            })
            .then(done, done.fail);
        });

        it('should return an empty object when the branch is not found', (done) => {
            findOnePromise.resolve(null);

            branchService.findById('some-id-1')
            .then((result) => {
                expect(Branch.findById).toHaveBeenCalled();
                expect(result).toEqual({});
            })
            .then(done, done.fail);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the branches list', (done) => {
                findOnePromise.reject('some db error the service should not rethrow');

                branchService.findById('some-id-1')
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Branch.findById).toHaveBeenCalled();
                    expect(error.message).toEqual('Error when looking up branch with id: some-id-1');
                })
                .then(done, done.fail);
            });
        });
    });

});
