'use strict';
var Branch = require('../../src/backend/models').Branch;
var Group = require('../../src/backend/models').Group;
var uuid = require('node-uuid');

var newBranch;

Group.truncate({cascade: true})
    .then(Branch.truncate({cascade: true}))
    .then(function() {
        return Branch.create({name: 'Branch name'});
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
    .then(console.log)
    .then(function() {
        console.log('Database seeded.');
        process.exit(0);
    })
  .catch(function (err) {
      console.log('Error: ' + err);
      process.exit(1);
  });
