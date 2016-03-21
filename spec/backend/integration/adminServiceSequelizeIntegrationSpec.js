'use strict';

const specHelper = require('../../support/specHelper'),
    Branch = specHelper.models.Branch,
    Group = specHelper.models.Group,
    AdminUser = specHelper.models.AdminUser;

var uuid = require('node-uuid');
var adminService = require('../../../src/backend/services/adminService');

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
        })
        .then(function() {
            return AdminUser.create({
                id: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174',
                email: 'some.email@email.com',
                password: 'some password',
                phoneNumber: '101010',
                name: 'Danny Dan Dan',
                branchId: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174'
            });
        });
}

describe('adminServiceSequelizeIntegrationSpec', () => {

    beforeEach((done) => {
        seed().nodeify(done);
    });

    describe('admin', () => {

        it('should return the branches groups if it has some', (done) => {
            let branchWithAdminsId = 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174';
            adminService.admins(branchWithAdminsId)
                .then((result) => {
                    expect(result.length).toEqual(1);
                }).then(done, done.fail);
        });

    });
});
