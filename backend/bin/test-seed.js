'use strict';

/* eslint no-console: off */
/* eslint import/no-extraneous-dependencies: off */

const AWS = require('aws-sdk');

const kinesis = new AWS.Kinesis({
  endpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

console.log('Running test seed script');
console.log('Creating kinesis stream for testing');

const StreamName = process.env.TEST_STREAM_NAME;
kinesis.createStream({ StreamName, ShardCount: 1 }).promise().then(
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
