'use strict';

const specHelper = require('../../../support/specHelper'),
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
    });

});
