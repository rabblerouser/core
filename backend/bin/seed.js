'use strict';

// This file runs whenever the backend is about to start.
// It makes sure that there's at least one network admin and branch in the database
// This is the minimum data needed for the app to function correctly

if (process.env.NODE_ENV === 'test') {
  console.log('Skipping regular seed script because NODE_ENV=test');
  console.log('Any necessary test data should be set up by a different script');
  process.exit(0);
}

const models = require('../src/models');

const email = 'networkadmin@rabblerouser.team';
const password = 'password';
const type = 'SUPER';

console.log('Running seed script');

const adminPromise = models.AdminUser.findAll()
  .then(adminUsers => {
    if (adminUsers.length === 0) {
      console.log(`No network admins exist, creating one - Username: ${email}, password: ${password}`);
      return models.AdminUser.create({ email, password, type });
    }
    console.log('At least one network admin already exists.');
    return undefined;
  });

const branchPromise = models.Branch.findAll()
  .then(branches => {
    if (branches.length === 0) {
      console.log('No branches exist, creating one - ');
      return models.Branch.create({ name: 'Default branch' });
    }
    console.log('At least one branch already exists.');
    return undefined;
  });

Promise.all([adminPromise, branchPromise])
  .then(() => console.log('Seeded successfully.'))
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
