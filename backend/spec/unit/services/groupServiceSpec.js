'use strict';

const models = require('../../../src/models');

const Group = models.Group;

const groupService = require('../../../src/services/groupService');

function fakeGroupsListFromDb() {
  return [
    {
      dataValues: {
        name: 'Waiting list',
        description: 'The waiting list group',
      },
    },
    {
      dataValues: {
        name: 'Tuesday at 9am',
        description: 'The list for the Tuesday at 9 group',
      },
    },
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

    it('should return all listed groups', done => {
      Group.findAll
                .returns(Promise.resolve(fakeGroupsListFromDb()));

      groupService.list().then(result => {
        expect(result.length).to.equal(2);
        expect(result[0].name).to.equal('Waiting list');
        expect(result[0].description).to.equal('The waiting list group');
      }).then(done)
            .catch(done);
    });

    describe('sad scenario', () => {
      it('should handle errors when retrieving the groups list', done => {
        Group.findAll.returns(Promise.reject('Obscure DB error the service should not rethrow'));

        groupService.list()
                .then(() => {
                  done.fail('This should not have succeded');
                })
                .catch(error => {
                  expect(Group.findAll).to.have.been.called;
                  expect(error.message).to.equal('An error has occurred while fetching groups');
                })
                .then(done)
                .catch(done);
      });
    });
  });
});
