'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      groupService = require('../../../../src/backend/services/groupService');

var groupsController = require('../../../../src/backend/controllers/groupsController');

function fakeGroupsList() {
    return [
        {
            dataValues: {
                name: 'Waiting list',
                description: 'The waiting list group'
            }
        },
        {
            dataValues: {
                name: 'Tuesday at 9am',
                description: 'The list for the Tuesday at 9 group'
            }
        }
    ];
}

describe('groupsController', () => {

    describe('list', () => {
        let req, res;

        beforeEach(() => {
            sinon.stub(groupService, 'list');
            res = {status: sinon.stub().returns({json: sinon.spy()})};
        });

        afterEach(() => {
            groupService.list.restore();
        });

        it('responds with a list of groups', (done) => {
            groupService.list.returns(Promise.resolve(fakeGroupsList()));

            groupsController.list(req, res)
            .then(() => {
                expect(res.status).toHaveBeenCalled(200);
                expect(res.status().json).toHaveBeenCalledWith({groups: fakeGroupsList()});
            }).then(done, done.fail);
        });
    });

    describe('list', () => {
        let req, res;

        beforeEach(() => {
            sinon.stub(groupService, 'create');
            res = {sendStatus: sinon.spy()};
        });

        afterEach(() => {
            groupService.create.restore();
        });

        it('returns 500 and an empty body when there is an unexpected error', (done) => {
            groupService.create.returns(Promise.reject('Error when creating a group'));

            req = {
                params: { branchId: 'some-branch-id'},
                body: {name: 'some-name', description: 'some-description'}
            };

            groupsController.create(req, res)
            .then(() => {
                expect(res.sendStatus).toHaveBeenCalled(500);
                expect(groupService.create).toHaveBeenCalled();
            }).then(done, done.fail);
        });
    });
});
