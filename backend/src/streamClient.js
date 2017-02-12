const createClient = require('rabblerouser-stream-client');
const config = require('./config');

const streamClientSettings = {
  stream: config.kinesis.stream,
  apiVersion: config.kinesis.apiVersion,
  region: config.kinesis.region,
  accessKeyId: config.kinesis.accessKeyId,
  secretAccessKey: config.kinesis.secretAccessKey,
  endpoint: config.kinesis.endpoint,
  eventAuthToken: config.eventAuthToken,
};

module.exports = createClient(streamClientSettings);
