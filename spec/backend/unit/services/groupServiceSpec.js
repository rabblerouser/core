'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      Group = specHelper.models.Group;

var groupService = require('../../../../src/backend/services/groupService');

function fakeGroupsListFromDb() {
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

describe('groupService', () => {
    describe('list', () => {

        beforeEach(() => {
            sinon.stub(Group, 'findAll');
        });

        afterEach(() => {
            Group.findAll.restore();
        });

        it('should return all listed groups', (done) => {
            Group.findAll
                .returns(Promise.resolve(fakeGroupsListFromDb()));

            groupService.list().then((result) => {
                expect(result.length).toEqual(2);
                expect(result[0].name).toEqual('Waiting list');
                expect(result[0].description).toEqual('The waiting list group');
            }).then(done, done.fail);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the groups list', (done) => {
                Group.findAll.returns(Promise.reject('Obscure DB error the service should not rethrow'));

                 groupService.list()
                .then(() => {
                    jasmine.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Group.findAll).toHaveBeenCalled();
                    expect(error.message).toEqual('An error has occurred while fetching groups');
                })
                .then(done, done.fail);
            });
        });
    });

});
