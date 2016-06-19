'use strict';

var Branch = require('../../src/models').Branch;
var Member = require('../../src/models').Member;
var Group = require('../../src/models').Group;

var newMember, newGroup, newBranch;
Member.truncate({cascade: true})
    .then(Branch.truncate({cascade: true}))
    .then(function() {
        return Branch.truncate({cascade: true});
    })
    .then(function() {
        return Branch.create({id: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174', name: 'Branch name groups'});
    })
    .then(function(branch) {
        newBranch = branch;
        return Member.create({firstName: 'Sherlock', lastName: 'Holmes', gender: 'horse radish', memberSince: new Date(), email: 'sherlock@holmes.co.uk', dateOfBirth: '01/01/1990', primaryPhoneNumber: '0396291146', secondaryPhoneNumber: '0394291146', residentialAddress: null, postalAddress: null, membershipType: 'full', branchId: 'fd4f7e67-66fe-4f7a-86a6-f031cb3af174', contactFirstName: 'Jaime', contactLastName: 'Garzon', additionalInfo: 'Lots of information'});
    })
  .then(function(member) {
    newMember = member;
    return Group.create({ name: 'Waiting List', description: 'This is a description of the waiting list' });
  })
  .then(function(group) {
    newGroup = group;
    newBranch.addGroup(group);
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
    console.log(groups);
  })
  .then(function() {
    console.log('Database seeded.');
    process.exit(0);
  })
  .catch(function (err) {
      console.log('Error: ' + err);
      process.exit(1);
  });
