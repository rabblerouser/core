'use strict';

// This file runs whenever the backend is about to start.
// It makes sure that there's at least one network admin and branch in the database
// This is the minimum data needed for the app to function correctly
// If we're not in production, it also creates the kinesis stream and the event archive S3 bucket

if (process.env.NODE_ENV === 'test') {
  console.log('Skipping regular seed script because NODE_ENV=test');
  console.log('Any necessary test data should be set up by a different script');
  process.exit(0);
}

const AWS = require('aws-sdk');
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

const createStream = () => {
  console.log('Creating kinesis stream for development');

  const kinesis = new AWS.Kinesis({
    endpoint: process.env.KINESIS_ENDPOINT,
    region: 'ap-southeast-2',
    accessKeyId: 'FAKE',
    secretAccessKey: 'ALSO FAKE',
  });

  return kinesis.createStream({ StreamName: 'rabblerouser_stream', ShardCount: 1 }).promise().then(
    () => console.log('rabblerouser_stream created'),
    err => {
      // Swallow these errors, but re-throw all others
      if (err.message.includes('already exists')) {
        console.log('Stream already exists');
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

const kinesisPromise = process.env.NODE_ENV === 'production' ? Promise.resolve() : createStream();
const s3Promise = process.env.NODE_ENV === 'production' ? Promise.resolve() : createArchiveBucket();

Promise.all([adminPromise, branchPromise, kinesisPromise, s3Promise])
  .then(() => console.log('Seeded successfully.'))
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
