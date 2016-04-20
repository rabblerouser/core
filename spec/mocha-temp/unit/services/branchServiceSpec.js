'use strict';

const sinon = require('sinon'),
      chai = require('chai'),
      expect = chai.expect,
      Q = require('q'),
      sinonChai = require('sinon-chai'),
      models = require('../../../../src/backend/models'),
      Branch = models.Branch;

chai.use(sinonChai);

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
                expect(result.length).to.equal(3);
                expect(result[0].id).to.equal('some-id-1');
                expect(result[0].name).to.equal('Geelong');
            }).then(done)
            .catch(done);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the branches list', (done) => {
                Branch.findAll.returns(Promise.reject('Obscure DB error the service should not rethrow'));

                 branchService.list()
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Branch.findAll).to.have.been.called;
                    expect(error.message).to.equal('An error has occurred while fetching branches');
                })
                .then(done)
                .catch(done);
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
                expect(Branch.findById).to.have.been.called;
                expect(result.id).to.equal('some-id-1');
                expect(result.name).to.equal('Ngamarriyanga (NT)');
            })
            .then(done)
            .catch(done);
        });

        it('should return an empty object when id is null', (done) => {
            branchService.findById(null)
            .then((result) => {console.log(result);
                expect(Branch.findById).not.to.have.been.called;
                expect(result).to.eql({});
            })
            .then(done)
            .catch(done);
        });

        it('should return an empty object when the branch is not found', (done) => {
            findOnePromise.resolve(null);

            branchService.findById('some-id-1')
            .then((result) => {
                expect(Branch.findById).to.have.been.called;
                expect(result).to.eql({});
            })
            .then(done)
            .catch(done);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the branches list', (done) => {
                findOnePromise.reject('some db error the service should not rethrow');

                branchService.findById('some-id-1')
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Branch.findById).to.have.been.called;
                    expect(error.message).to.equal('Error when looking up branch with id: some-id-1');
                })
                .then(done)
                .catch(done);
            });
        });
    });

});
