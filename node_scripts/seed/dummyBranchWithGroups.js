'use strict';
var Branch = require('../../src/backend/models').Branch;
var Group = require('../../src/backend/models').Group;
var uuid = require('node-uuid');

var newBranch;

Group.truncate({cascade: true})
    .then(Branch.truncate({cascade: true}))
    .then(function() {
        return Branch.create({id: 'aa3538ae-763d-49d9-ac23-2281ba2145e4', name: 'Branch name no groups'});
    })
    .then(function() {
        return Branch.create({id: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174', name: 'Branch name groups'});
    })
    .then(function(branch) {
      newBranch = branch;
      return Group.create({ id: uuid(), name: 'Waiting List', description: 'This is a description of the waiting list' });
    })
    .then(function(group) {
      return newBranch.addGroup(group);
    })
  .then(function() {
      return Group.create({ id: uuid(), name: 'Waiting List2', description: 'This is a description of the waiting list2' });
  })
  .then(function(group) {
      return newBranch.addGroup(group);
  })
    .then(function() {
        return newBranch.getGroups();
    })
    .then(function() {
        console.log('Database seeded.');
        process.exit(0);
    })
  .catch(function (err) {
      console.log('Error: ' + err);
      process.exit(1);
  });
