const createClient = require('rabblerouser-stream-client');
const config = require('./config');

const streamClientSettings = {
  stream: 'rabblerouser_stream',
  apiVersion: '2013-12-02',
  region: 'ap-southeast-2',
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  endpoint: config.aws.kinesisEndpoint,
  eventAuthToken: config.eventAuthToken,
};

module.exports = createClient(streamClientSettings);
