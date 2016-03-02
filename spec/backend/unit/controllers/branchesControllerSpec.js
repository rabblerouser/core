'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      branchService = require('../../../../src/backend/services/branchService');

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
});
