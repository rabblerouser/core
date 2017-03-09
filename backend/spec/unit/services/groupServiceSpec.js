'use strict';

const models = require('../../../src/models');

const Group = models.Group;
const Q = require('q');

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

  describe('update', () => {
    beforeEach(() => {
      sinon.stub(Group, 'findById');
      sinon.stub(Group, 'update');
    });

    afterEach(() => {
      Group.update.restore();
      Group.findById.restore();
    });

    it('should update the group', done => {
      Group.findById.returns(Q.resolve(Group));
      Group.update.returns(Q.resolve({ dataValues: { name: 'A group', description: 'description', id: 'some-group-id' } }));

      groupService.update({ id: 'some-group-id', name: 'A group', description: 'description' }, 'some-group-id')
            .then(() => {
              expect(Group.findById).to.have.been.called;
              expect(Group.update).to.have.been.called;
            })
            .then(done)
            .catch(done);
    });

    describe('sad scenario', () => {
      it('should handle when the group is not found', done => {
        Group.findById.returns(Q.resolve(null));
        Group.update.returns(Q.resolve({ dataValues: { name: 'A group', description: 'description', id: 'some-group-id' } }));

        groupService.update({ id: 'some-group-id', name: 'A group', description: 'description' }, 'some-group-id')
                .then(() => {
                  done.fail('This should not have succeded');
                })
                .catch(error => {
                  expect(Group.findById).to.have.been.called;
                  expect(Group.update).not.to.have.been.called;
                  expect(error.message).to.equal('An error has occurred while updating a group with id: some-group-id');
                })
                .then(done)
                .catch(done);
      });

      it('should handle errors when updating', done => {
        Group.findById.returns(Q.resolve(Group));
        Group.update.returns(Promise.reject('Obscure DB error the service should not rethrow'));

        groupService.update({ id: 'some-group-id', name: 'A group', description: 'description' }, 'some-group-id')
                .then(() => {
                  done.fail('This should not have succeded');
                })
                .catch(error => {
                  expect(Group.findById).to.have.been.called;
                  expect(Group.update).to.have.been.called;
                  expect(error.message).to.equal('An error has occurred while updating a group with id: some-group-id');
                })
                .then(done)
                .catch(done);
      });
    });
  });
});
