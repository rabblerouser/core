'use strict';
const Branch = require('../../src/models').Branch;
const AdminUser = require('../../src/models').AdminUser;
const Member = require('../../src/models').Member;
const Group = require('../../src/models').Group;
const uuid = require('node-uuid');
const branchId = uuid();
let branch;
let group;

Branch.create({ id: branchId, name: 'A branch' })
.then(created => { branch = created; })
.then(() => process.stdout.write('Database seeded with branch: \'A branch\'.\n'))
.then(() => AdminUser.create({ email: 'organiser@rr.com', password: 'apassword', branchId, type: 'BRANCH' }))
.then(() => process.stdout.write('Database seeded with organiser: organiser@rr.com.\n'))
.then(() => Group.create({ name: 'A group with member', description: 'This is a description' }))
.then(created => { group = created; })
.then(() => branch.addGroup(group))
.then(() => process.stdout.write('Database seeded with group: \'a group with a member\'.\n'))
.then(() => Member.create(
  { firstName: 'A name', lastName: 'surname', gender: 'social-construct',
    contactFirstName: 'A name', contactLastName: 'surname',
    memberSince: new Date(), email: 'a@name.com', dateOfBirth: '01/01/1990', primaryPhoneNumber: '0',
    secondaryPhoneNumber: '1', residentialAddress: null, postalAddress: null, membershipType: 'full',
    branchId, schoolType: 'Primary', additionalInfo: '' })
)
.then(created => {
  group.addMember(created);
  return created.addGroup(group);
})
.then(() => process.stdout.write('Database seeded with member: \'A name\'.\n'))
.then(() => process.exit(0))
.catch(err => {
  process.stdout.write(`Error: ${err}`);
  process.exit(1);
});
