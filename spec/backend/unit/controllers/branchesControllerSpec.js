'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      branchService = require('../../../../src/backend/services/branchService');

var branchesController = require('../../../../src/backend/controllers/branchesController');

function fakeBranchesList() {
    return [
        {
            key:'some-key-1',
            name: 'Geelong'
        },
        {
            key:'some-key-2',
            name: 'Frankston'
        },
        {
            key:'some-key-3',
            name: 'Hawthorn'
        }
    ];
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
    });
});
