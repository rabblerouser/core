'use strict';

var Branch = require('../../src/backend/models').Branch;
var Member = require('../../src/backend/models').Member;
var Group = require('../../src/backend/models').Group;

var newMember, newGroup;

Branch.create({name: 'Branch name'})
  .then(function() {
    return Member.create({firstName: 'Sherlock', lastName: 'Holmes', gender: 'horse radish', email: 'sherlock@holmes.co.uk', dateOfBirth: '01/01/1990', primaryPhoneNumber: '0396291146', secondaryPhoneNumber: '0394291146', residentialAddress: null, postalAddress: null, membershipType: 'full', branchId: '0863a85e-e7d8-42db-8b16-80635b7ccbad', schoolType: 'Primary', contactFirstName: 'Jaime', contactLastName: 'Garzon', additionalInfo: 'Lots of information' });
  })
  .then(function(member) {
    newMember = member;
    return Group.create({ name: 'Waiting List', description: 'This is a description of the waiting list' });
  })
  .then(function(group) {
    newGroup = group;
    return newMember.addGroup(newGroup);
  })
  .then(function() {
    return newGroup.addMember(newMember);
  })
  .then(function() {
    return newGroup.getMembers();
  })
  .then(function(members) {
    console.log(members);
    return newMember.getGroups();
  })
  .then(function(groups) {
    console.log(groups)
  })
  .then(function() {
    console.log('Database seeded.');
    process.exit(0);
  })
  .catch(function (err) {
      console.log('Error: ' + err);
      process.exit(1);
  });
