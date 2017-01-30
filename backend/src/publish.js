const publisher = require('rabblerouser-publisher');
const config = require('./config');

module.exports = publisher({
  stream: 'rabblerouser_stream',
  apiVersion: '2013-12-02',
  region: 'ap-southeast-2',
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});
