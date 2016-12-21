const uuid = require('node-uuid');

const models = require('../src/models');
const Branch = models.Branch;
const AdminUser = models.AdminUser;
const Member = models.Member;
const Group = models.Group;

const branchId = uuid();
let branch;
let group;

console.log('Running script to seed data necessary for E2E tests');

Promise.all([Branch, AdminUser, Group]
  .map(model => model.destroy({ truncate: true, cascade: true, force: true }))
)
.then(() => process.stdout.write('Database cleared of branches, groups, admins, organisers.\n'))

.then(() => AdminUser.create({ email: 'admin@rr.com', password: 'apassword', type: 'SUPER' }))
.then(() => process.stdout.write('Database seeded with admin: admin@rr.com.\n'))

.then(() => Branch.create({ id: branchId, name: 'A branch' }))
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
    memberSince: new Date(), email: 'a@name.com', primaryPhoneNumber: '0',
    secondaryPhoneNumber: '1', residentialAddress: null, postalAddress: null, membershipType: 'full',
    branchId, additionalInfo: '' })
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
