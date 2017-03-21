'use strict';

/* eslint no-console: off */
/* eslint import/no-extraneous-dependencies: off */

// This script can be run manually via npm to prepare data for the app
// - It inserts an Admin user into the relational DB directly
// - It publishes a "branch-created" event onto the rabblerouser kinesis stream
// - In development, it also ensures that the kinesis stream and event S3 bucket have been created
//   (In production, these are created by terraform before the app is deployed)

const AWS = require('aws-sdk');
const branchesController = require('../src/controllers/branchesController');
const models = require('../src/models');

const email = 'networkadmin@rabblerouser.team';
const password = 'password';
const type = 'SUPER';

const createAdmin = () => (
  models.AdminUser.findAll()
    .then(adminUsers => {
      if (adminUsers.length === 0) {
        console.log(`No network admins exist, creating one - Username: ${email}, password: ${password}`);
        return models.AdminUser.create({ email, password, type });
      }
      console.log('At least one network admin already exists.');
      return undefined;
    })
);

const createStream = () => {
  console.log('Creating kinesis stream for development');

  const kinesis = new AWS.Kinesis({
    endpoint: process.env.KINESIS_ENDPOINT,
    region: 'ap-southeast-2',
    accessKeyId: 'FAKE',
    secretAccessKey: 'ALSO FAKE',
  });

  const StreamName = process.env.STREAM_NAME;
  return kinesis.createStream({ StreamName, ShardCount: 1 }).promise().then(
    () => console.log(`${StreamName} created`),
    err => {
      // Swallow these errors, but re-throw all others
      if (err.message.includes('already exists')) {
        console.log(`${StreamName} already exists`);
        return;
      }
      throw new Error(`Could not create stream: ${err.message}`);
    }
  );
};

const createArchiveBucket = () => {
  console.log('Creating archive S3 bucket for development');

  const s3 = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    region: 'ap-southeast-2',
    accessKeyId: 'FAKE',
    secretAccessKey: 'ALSO FAKE',
  });

  return s3.createBucket({ Bucket: process.env.ARCHIVE_BUCKET }).promise().then(
    () => console.log(`${process.env.ARCHIVE_BUCKET} created`),
    err => { throw new Error(`Could not create bucket: ${err.message}`); }
  );
};

const createStreamAndBucket = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Not creating kinesis stream or S3 bucket. These should already be there in production.');
    return undefined;
  }
  return Promise.all([createStream(), createArchiveBucket()]);
};

const fakeRes = () => {
  const res = {
    lastStatus: null,
    lastJson: null,
  };
  res.status = status => { res.lastStatus = status; return res; };
  res.sendStatus = status => { res.lastStatus = status; return res; };
  res.json = json => { res.lastJson = json; return res; };
  return res;
};

const createDefaultBranch = () => {
  console.log('Creating default branch.');
  const req = { body: { name: 'Default branch' } };
  const res = fakeRes();
  return branchesController.createBranch(req, res)
    .then(() => {
      if (res.lastStatus === 200) {
        console.log('Default branch created');
        return Promise.resolve();
      }
      console.log('Failed to create default branch');
      return Promise.reject({ status: res.lastStatus, json: res.lastJson });
    });
};

const wait = () => {
  console.log('Waiting for a few seconds for things to be ready...');
  return new Promise(resolve => setTimeout(resolve, 5000));
};

console.log('Running seed script');
Promise.resolve()
  .then(createAdmin)
  .then(createStreamAndBucket)
  .then(wait)
  .then(createDefaultBranch)
  .then(() => console.log('Seeded successfully.'))
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
