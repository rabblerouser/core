const AWS = require('aws-sdk');

if (process.env.NODE_ENV === 'production') {
  console.log('Not creating stream in production. It should already be there.');
  process.exit(0);
}

console.log('Running createStream script');

const kinesis = new AWS.Kinesis({
  endpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

kinesis.createStream({ StreamName: 'rabblerouser_stream', ShardCount: 1 }).promise().then(
  () => console.log('rabblerouser_stream created'),
  err => { throw new Error(`Could not create stream: ${err.message}`); }
);
