const createClient = require('rabblerouser-stream-client');
const config = require('./config');

const streamClientSettings = {
  publishToStream: config.eventStream.streamName,
  listenWithAuthToken: config.eventStream.listenerAuthToken,

  region: config.eventStream.region,
  accessKeyId: config.eventStream.accessKeyId,
  secretAccessKey: config.eventStream.secretAccessKey,

  kinesisEndpoint: config.eventStream.kinesisEndpoint,
};

module.exports = createClient(streamClientSettings);
