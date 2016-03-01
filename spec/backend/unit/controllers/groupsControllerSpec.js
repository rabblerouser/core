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
});
