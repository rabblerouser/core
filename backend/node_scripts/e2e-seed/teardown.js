const models = require('../../src/models');
Promise.all([models.Branch, models.AdminUser].map(model => model.truncate({ cascade: true })))
.then(() => process.stdout.write('Database cleared of branches, admins, organisers.\n'))
.then(() => process.exit(0))
.catch(err => {
  process.stdout.write(`Error: ${err}`);
  process.exit(1);
});
