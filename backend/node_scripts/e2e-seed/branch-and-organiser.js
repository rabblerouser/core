const Branch = require('../../src/models').Branch;
const AdminUser = require('../../src/models').AdminUser;
const uuid = require('node-uuid');
const branchId = uuid();

Branch.create({ id: branchId, name: 'A branch' })
.then(() => process.stdout.write('Database seeded with branch: \'A branch\'.\n'))
.then(() =>
  AdminUser.create({ email: 'organiser@rr.com', password: 'apassword', branchId, type: 'BRANCH' })
)
.then(() => process.stdout.write('Database seeded with organiser: organiser@rr.com.\n'))
.then(() => process.exit(0))
.catch(err => {
  process.stdout.write(`Error: ${err}`);
  process.exit(1);
});
