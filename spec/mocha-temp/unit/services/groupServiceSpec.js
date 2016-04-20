'use strict';
/*jshint expr: true*/

const models = require('../../../../src/backend/models');
let Group = models.Group;
let Branch = models.Branch;
const Q = require('q');

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
                expect(result.length).to.equal(2);
                expect(result[0].name).to.equal('Waiting list');
                expect(result[0].description).to.equal('The waiting list group');
            }).then(done)
            .catch(done);
        });

        describe('sad scenario', () => {
            it('should handle errors when retrieving the groups list', (done) => {
                Group.findAll.returns(Promise.reject('Obscure DB error the service should not rethrow'));

                 groupService.list()
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Group.findAll).to.have.been.called;
                    expect(error.message).to.equal('An error has occurred while fetching groups');
                })
                .then(done)
                .catch(done);
            });
        });
    });

    describe('create', () => {
        beforeEach(() => {
            sinon.stub(Branch, 'findById');
            sinon.stub(Group, 'create');
        });

        afterEach(() => {
            Branch.findById.restore();
            Group.create.restore();
        });

        it('should handle when the branch is not found', (done) => {
            Branch.findById.returns(Q.resolve(null));
            Group.create.returns(Q.resolve({dataValues: {name: 'A group', description: 'description', id: 'some-group-id'}}));

            groupService.create({name: 'A group', description: 'description'}, 'some-branch-id')
            .then(() => {
                done.fail('This should not have succeded');
            })
            .catch((error) => {
                expect(Branch.findById).to.have.been.called;
                expect(Group.create).not.to.have.been.called;
                expect(error.message).to.equal('An error has occurred while creating group for branch with id: some-branch-id');
            })
            .then(done)
            .catch(done);
        });

        it('should handle when there is an error creating the branch', (done) => {
            Branch.findById.returns(Q.resolve({dataValues: {id: 'some-branch-id'}}));
            Group.create.returns(Q.reject('A horrible DB error the service should not rethrow'));

            groupService.create({name: 'A group', description: 'description'}, 'some-branch-id')
            .then(() => {
                done.fail('This should not have succeded');
            })
            .catch((error) => {
                expect(Branch.findById).to.have.been.called;
                expect(Group.create).to.have.been.called;
                expect(error.message).to.equal('An error has occurred while creating group for branch with id: some-branch-id');
            })
            .then(done)
            .catch(done);
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

        it('should update the group', (done) => {
            Group.findById.returns(Q.resolve(Group));
            Group.update.returns(Q.resolve({dataValues: {name: 'A group', description: 'description', id: 'some-group-id'}}));

            groupService.update({id: 'some-group-id', name: 'A group', description: 'description'}, 'some-group-id')
            .then(() => {
                expect(Group.findById).to.have.been.called;
                expect(Group.update).to.have.been.called;
            })
            .then(done)
            .catch(done);
        });

        describe('sad scenario', () => {

            it('should handle when the group is not found', (done) => {
                Group.findById.returns(Q.resolve(null));
                Group.update.returns(Q.resolve({dataValues: {name: 'A group', description: 'description', id: 'some-group-id'}}));

                groupService.update({id: 'some-group-id', name: 'A group', description: 'description'}, 'some-group-id')
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Group.findById).to.have.been.called;
                    expect(Group.update).not.to.have.been.called;
                    expect(error.message).to.equal('An error has occurred while updating a group with id: some-group-id');
                })
                .then(done)
                .catch(done);
            });

            it('should handle errors when updating', (done) => {
                Group.findById.returns(Q.resolve(Group));
                Group.update.returns(Promise.reject('Obscure DB error the service should not rethrow'));

                groupService.update({id: 'some-group-id', name: 'A group', description: 'description'}, 'some-group-id')
                .then(() => {
                    done.fail('This should not have succeded');
                })
                .catch((error) => {
                    expect(Group.findById).to.have.been.called;
                    expect(Group.update).to.have.been.called;
                    expect(error.message).to.equal('An error has occurred while updating a group with id: some-group-id');
                })
                .then(done)
                .catch(done);
            });
        });

    });

    describe('delete', () => {
        beforeEach(() => {
            sinon.stub(Group, 'destroy');
        });

        afterEach(() => {
            Group.destroy.restore();
        });

        it('should delete the group', (done) => {
            Group.destroy.returns(Promise.resolve(1));

            groupService.delete('some-group-id')
            .then(() => {
                expect(Group.destroy).to.have.been.calledWith({where: {id: 'some-group-id'}});
            })
            .then(done)
            .catch(done);
        });

        describe('this went bad', () => {

            it('should handle when no groupId provided', (done) => {
                Group.destroy.returns(Promise.resolve(0));

                groupService.delete(null)
                .then(() => {
                    done.fail('this should have failed');
                })
                .catch((error) => {
                    expect(Group.destroy).to.have.been.called;
                    expect(error.message).to.equal('An error has occurred while deleting the group with id: null');
                })
                .then(done)
                .catch(done);
            });

            it('should handle when deleting the group fails', (done) => {
                Group.destroy.returns(Promise.reject('DB error the user should not see'));

                groupService.delete('some-group-id')
                .then(() => {
                    done.fail('this should have failed');
                })
                .catch((error) => {
                    expect(Group.destroy).to.have.been.called;
                    expect(error.message).to.equal('An error has occurred while deleting the group with id: some-group-id');
                })
                .then(done)
                .catch(done);
            });
        });
    });

});
