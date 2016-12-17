'use strict';

// This file runs whenever the backend is about to start.
// It makes sure that there's at least one network admin and branch in the database
// This is the minimum data needed for the app to function correctly

const models = require('../src/models');

const email = 'example@example.com';
const password = 'password';
const type = 'SUPER';

models.AdminUser.findAll()
  .then(adminUsers => {
    if (adminUsers.length === 0) {
      console.log(`No network admins exist, creating one - Username: ${email}, password: ${password}`);
      return models.AdminUser.create({ email, password, type });
    }
    console.log(`At least one network admin already exists.`);
  })
  .catch(err => {
    console.error('Error: Could not create admin user:', err);
    process.exit(1);
  });

models.Branch.findAll()
  .then(branches => {
    if (branches.length === 0) {
      console.log(`No branches exist, creting one - `);
      return models.Branch.create({ name: 'Default branch' });
    }
    console.log('At least one branch already exists.');
  })
  .catch(err => {
    console.error('Error: Could not create branch:', err);
    process.exit(1);
  });
