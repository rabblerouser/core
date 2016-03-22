'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      branchService = require('../../../../src/backend/services/branchService'),
      branchValidator = require('../../../../src/backend/lib/branchValidator');

var branchesController = require('../../../../src/backend/controllers/branchesController');

function fakeBranchesList() {
    return [
        {
            id:'some-id-1',
            name: 'Geelong'
        },
        {
            id:'some-id-2',
            name: 'Frankston'
        },
        {
            id:'some-id-3',
            name: 'Hawthorn'
        }
    ];
}

function branch() {
    return {
        id:'some-id-1',
        name: 'Geelong'
    };
}

function fakeGroupsList() {
    return [
        {
            id: 'some-key',
            name: 'some group name',
            description: 'some description'
        },
        {
            id: 'some-key2',
            name: 'some group name2',
            description: 'some description2'
        }
    ];
}

function noGroupsList() {
    return [];
}

describe('branchesController', () => {

    describe('create', () => {
        let req, res;

        describe('when the payload is valid', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    body: {
                        name: 'some-name'
                    }
                };
                sinon.stub(branchValidator, 'isValid').returns([]);
                sinon.stub(branchService, 'create');
            });

            afterEach(() => {
                branchService.create.restore();
                branchValidator.isValid.restore();
            });

            it('responds with successful update', (done) => {
                branchService.create.returns(Promise.resolve(branch()));
                branchesController.create(req, res)
                .then(() => {
                    expect(res.status).toHaveBeenCalled(200);
                    expect(res.status().json).toHaveBeenCalledWith(branch());
                }).then(done, done.fail);
            });

        });

        describe('when the payload provided is invalid', () => {
            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    body: {
                        name: 'invalid'
                    }
                };
                sinon.stub(branchValidator, 'isValid').returns(['name']);
            });

            afterEach(() => {
                branchValidator.isValid.restore();
            });

            it('should return a 400', () => {
                branchesController.create(req, res);
                expect(res.status).toHaveBeenCalled(400);
            });

        });

        describe('when there is a general error from the service', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    body: {
                        name: 'some name'
                    }
                };
                sinon.stub(branchValidator, 'isValid').returns([]);
                sinon.stub(branchService, 'create');
            });

            afterEach(() => {
                branchService.create.restore();
                branchValidator.isValid.restore();
            });

            it('should return a 500', (done) => {
                branchService.create.returns(Promise.reject('anything at all'));
                branchesController.create(req, res)
                .then(() => {
                   expect(res.status).toHaveBeenCalled(500);
                }).then(done, done.fail);
            });
        });
    });

    describe('update', () => {
        let req, res;

        describe('when the branch id is valid and the admin id is valid', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    params: { branchId: 1},
                    body: {
                        id: 1,
                        name: 'some name'
                    }
                };
                sinon.stub(branchValidator, 'isValid').returns([]);
                sinon.stub(branchService, 'update').withArgs(req.params.id);
            });

            afterEach(() => {
                branchService.update.restore();
                branchValidator.isValid.restore();
            });

            it('responds with successful update', (done) => {
                branchService.update.returns(Promise.resolve(branch()));
                branchesController.update(req, res)
                .then(() => {
                    expect(res.status).toHaveBeenCalled(200);
                    expect(res.status().json).toHaveBeenCalledWith(branch());
                }).then(done, done.fail);
            });

        });

        describe('when the branch id is undefined', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    params: { id: 'some-key'},
                    body: {
                        id: 'some-key',
                        email: 'some-email',
                        name: 'some name',
                        phone: 'some phone'
                    }
                };
            });

            it('should return a 400', () => {
                branchesController.update(req, res);
                expect(res.status).toHaveBeenCalled(400);
            });
        });

        describe('when the branch id is undefined', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    params: {},
                    body: {
                        id: 'some-key',
                        email: 'some-email',
                        name: 'some name',
                        phone: 'some phone'
                    }
                };
            });

            it('should return a 400', () => {
                branchesController.update(req, res);
                expect(res.status).toHaveBeenCalled(400);
            });
        });

        describe('when the branch id doesn\'t match the one in the payload', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    params: { branchId: 'some-other-key'},
                    body: {
                        id: 'some-key',
                        email: 'some-email',
                        name: 'some name',
                        phone: 'some phone'
                    }
                };

                it('should return a 400', (done) => {
                    branchesController.update(req, res)
                    .then(() => {
                       expect(res.status).toHaveBeenCalled(400);
                    }).then(done, done.fail);
                });
            });
        });

        describe('when the payload provided is invalid', () => {
            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    params: { branchId: 1},
                    body: {
                        email: 'some phone'
                    }
                };
                sinon.stub(branchValidator, 'isValid').returns(['email']);
            });

            afterEach(() => {
                branchValidator.isValid.restore();
            });

            it('should return a 400', () => {
                branchesController.update(req, res);
                expect(res.status).toHaveBeenCalled(400);
            });

        });

        describe('when there is a general error from the service', () => {

            beforeEach(() => {
                res = {status: sinon.stub().returns({json: sinon.spy()})};
                req = {
                    params: { branchId: 'some-key'},
                    body: {
                        id: 'some-key',
                        name: 'some name'
                    }
                };
                sinon.stub(branchValidator, 'isValid').returns([]);
                sinon.stub(branchService, 'update').withArgs(req.params.id);
            });

            afterEach(() => {
                branchService.update.restore();
                branchValidator.isValid.restore();
            });

            it('should return a 500', (done) => {
                branchService.update.returns(Promise.reject('anything at all'));
                branchesController.update(req, res)
                .then(() => {
                   expect(res.status).toHaveBeenCalled(500);
                }).then(done, done.fail);
            });
        });
    });

    describe('list', () => {
        let req, res;

        beforeEach(() => {
            sinon.stub(branchService, 'list');
            res = {status: sinon.stub().returns({json: sinon.spy()})};
        });

        afterEach(() => {
            branchService.list.restore();
        });

        it('responds with a list of branches', (done) => {
            branchService.list.returns(Promise.resolve(fakeBranchesList()));

            branchesController.list(req, res)
            .then(() => {
                expect(res.status).toHaveBeenCalled(200);
                expect(res.status().json).toHaveBeenCalledWith({branches: fakeBranchesList()});
            }).then(done, done.fail);
        });

        describe('things went bad', () => {
            it('should return 500 when there is an unexpected error', (done) => {
                res = {sendStatus: sinon.spy()};
                branchService.list.returns(Promise.reject('some service error'));

                branchesController.list(req, res)
                .then(() => {
                    expect(res.sendStatus).toHaveBeenCalledWith(500);
                })
                .then(done, done.fail);
            });
        });
    });

    describe('groupsInBranch', ()=> {

        let req, res;

        beforeEach(() => {
            res = {status: sinon.stub().returns({json: sinon.spy()})};
            req = { params: { id: 1} };
            sinon.stub(branchService, 'groupsInBranch').withArgs(req.params.id);
        });

        afterEach(() => {
            branchService.groupsInBranch.restore();
        });

        describe('when the branch id is valid and has groups', () => {

            beforeEach( () => {
                branchService.groupsInBranch.returns(Promise.resolve(fakeGroupsList()));
            });

            it('responds with a list of groups', (done) => {
                branchesController.groupsByBranch(req, res)
                .then(() => {
                    expect(res.status).toHaveBeenCalled(200);
                    expect(res.status().json).toHaveBeenCalledWith({groups: fakeGroupsList()});
                }).then(done, done.fail);
            });

        });

        describe('when the branch id is valid and has no groups', () => {

            beforeEach( () => {
                branchService.groupsInBranch.returns(Promise.resolve(noGroupsList()));
            });

            it('responds with an empty list of groups', (done) => {
                branchesController.groupsByBranch(req, res)
                .then(() => {
                    expect(res.status).toHaveBeenCalled(200);
                    expect(res.status().json).toHaveBeenCalledWith({groups: noGroupsList()});
                }).then(done, done.fail);
            });

        });

        describe('when the branch id is invalid', () => {
            it('should return a 400', (done) => {
                branchService.groupsInBranch.returns(Promise.reject('invalid branch id'));

              branchesController.groupsByBranch(req, res)
              .then(() => {
                  expect(res.status).toHaveBeenCalled(400);
              }).then(done, done.fail);
            });
        });

        describe('when there is a general error from the service', () => {
            it('should return a 500', (done) => {
                branchService.groupsInBranch.returns(Promise.reject('anything at all'));

              branchesController.groupsByBranch(req, res)
              .then(() => {
                  expect(res.status).toHaveBeenCalled(500);
              }).then(done, done.fail);
            });
        });
    });

    describe('branchesForAdmin', () => {
        describe('things did not go well', () => {
            beforeEach(() => {
                sinon.stub(branchService, 'findById');
            });

            afterEach(() => {
                branchService.findById.restore();
            });

            it('should handle errors from the service', (done) => {
                branchService.findById.returns(Promise.reject('some service error'));
                let res = {sendStatus: sinon.spy()};

                branchesController.list({}, res)
                .then(() => {
                    expect(res.sendStatus).toHaveBeenCalledWith(500);
                })
                .then(done, done.fail);
            });
        });
    });
});
