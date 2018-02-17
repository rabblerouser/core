'use strict';

const baseConfig = {
  session: {
    secret: process.env.SESSION_SECRET || "i'm a teapot",
    domain: process.env.SESSION_DOMAIN,
  },
  eventStream: {
    listenerAuthToken: process.env.LISTENER_AUTH_TOKEN,
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'ALSO FAKE',
  },
};

const devConfig = Object.assign({}, baseConfig, {
  bcryptRounds: 10,
  session: Object.assign({}, baseConfig.session, {
    proxy: false,
    secureCookie: false,
  }),
  eventStream: Object.assign({}, baseConfig.eventStream, {
    kinesisEndpoint: process.env.KINESIS_ENDPOINT,
    s3Endpoint: process.env.S3_ENDPOINT,
    streamName: process.env.STREAM_NAME,
    archiveBucket: process.env.ARCHIVE_BUCKET,
  }),
});

const testConfig = Object.assign({}, baseConfig, {
  bcryptRounds: 1,
  eventStream: Object.assign({}, baseConfig.eventStream, {
    kinesisEndpoint: process.env.KINESIS_ENDPOINT,
    streamName: process.env.TEST_STREAM_NAME,
    // No archive bucket or S3 endpoint for testing
  }),
});

const prodConfig = Object.assign({}, baseConfig, {
  bcryptRounds: 10,
  session: Object.assign({}, baseConfig.session, {
    proxy: true,
    secureCookie: true,
  }),
  eventStream: Object.assign({}, baseConfig.eventStream, {
    streamName: process.env.STREAM_NAME,
    archiveBucket: process.env.ARCHIVE_BUCKET,
  }),
});

const pickConfig = () => {
  if (process.env.NODE_ENV === 'production') { return prodConfig; }
  if (process.env.NODE_ENV === 'test') { return testConfig; }
  return devConfig;
};

module.exports = pickConfig();
