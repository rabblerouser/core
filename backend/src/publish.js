const createClient = require('rabblerouser-stream-client');
const config = require('./config');

const streamClientSettings = {
  stream: 'rabblerouser_stream',
  apiVersion: '2013-12-02',
  region: 'ap-southeast-2',
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
};
const streamClient = createClient(streamClientSettings);

module.exports = streamClient.publish;
