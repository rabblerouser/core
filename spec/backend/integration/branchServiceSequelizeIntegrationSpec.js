'use strict';

const specHelper = require('../../support/specHelper'),
    Branch = specHelper.models.Branch,
    Group = specHelper.models.Group;

var uuid = require('node-uuid');
var branchService = require('../../../src/backend/services/branchService');

function seed() {
    let branchWithGroups;
    return Branch.create({
            id: 'aa3538ae-763d-49d9-ac23-2281ba2145e4',
            name: 'Branch name no groups'
        })
        .then(function() {
            return Branch.create({
                id: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174',
                name: 'Branch name groups'
            });
        })
        .then(function(branch) {
            branchWithGroups = branch;
            return Group.create({
                id: uuid(),
                name: 'Waiting List',
                description: 'This is a description of the waiting list'
            });
        })
        .then(function(group) {
            return branchWithGroups.addGroup(group);
        })
        .then(function() {
            return Group.create({
                id: uuid(),
                name: 'Waiting List2',
                description: 'This is a description of the waiting list2'
            });
        })
        .then(function(group) {
            return branchWithGroups.addGroup(group);
        });
}

describe('branchService', () => {

    beforeEach((done) => {
        seed().nodeify(done);

    });

    describe('groupsInBranch', () => {

        it('should return the branches groups if it has some', (done) => {
            let branchWithGroupsId = 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174';
            branchService.groupsInBranch(branchWithGroupsId)
                .then((result) => {
                    expect(result.length).toEqual(2);
                }).then(done, done.fail);
        });

        it('should return no groups if the branch has none', (done) => {
            let branchWithNoGroupsId = 'aa3538ae-763d-49d9-ac23-2281ba2145e4';
            branchService.groupsInBranch(branchWithNoGroupsId)
                .then((result) => {
                    expect(result).toEqual([]);
                }).then(done, done.fail);
        });

        describe('sad scenarios', () => {
            it('should handle an invalid branchId', (done) => {
                let invalidBranchId = 'invalidId';
                branchService.groupsInBranch(invalidBranchId)
                    .then(() => {
                        jasmine.fail('This should not have succeded');
                    })
                    .catch((error) => {
                        expect(error.message).toEqual('Error when looking up branch with id: invalidId');
                    }).then(done, done.fail);
            });
        });
    });
});
