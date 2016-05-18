const AdminUser = require('../../src/models').AdminUser;
AdminUser.create({ email: 'admin@rr.com', password: 'apassword', type: 'SUPER' })
.then(() => process.stdout.write('Database seeded with admin: admin@rr.com.\n'))
.then(() => process.exit(0))
.catch(err => {
  process.stdout.write(`Error: ${err}`);
  process.exit(1);
});
