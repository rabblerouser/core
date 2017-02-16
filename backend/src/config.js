'use strict';

const baseConfig = {
  email: {
    sendEmails: process.env.SEND_EMAILS,
    transporter: process.env.EMAIL_TRANSPORTER,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    replyTo: process.env.EMAIL_REPLY_TO,
    welcomeSubject: process.env.EMAIL_WELCOME_SUBJECT || 'Welcome to Rabble Rouser',
    welcomeBody: process.env.EMAIL_WELCOME_BODY || 'Welcome to Rabble Rouser!<br>You can now start participating and getting involved towards the development of a more secure and transparent Australia.\nFor a list of upcoming meetings and discussions, head to rabblerouser.team\nBest,\nRabble Rouser',
  },
  session: {
    secret: process.env.SESSION_SECRET || "i'm a teapot",
    domain: process.env.SESSION_DOMAIN,
  },
  eventStream: {
    streamName: 'rabblerouser_stream',
    listenerAuthToken: process.env.LISTENER_AUTH_TOKEN || 'secret',
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'ALSO FAKE',
  },
};

const devConfig = Object.assign({}, baseConfig, {
  session: Object.assign({}, baseConfig.session, {
    proxy: false,
    secureCookie: false,
  }),
  eventStream: Object.assign({}, baseConfig.eventStream, {
    kinesisEndpoint: 'http://localhost:4567',
  }),
  logFormat: '[:date[iso]] :method :url :status :response-time ms - :req[header]',
});

const prodConfig = Object.assign({}, baseConfig, {
  session: Object.assign({}, baseConfig.session, {
    proxy: true,
    secureCookie: true,
  }),
  logFormat: '[:date[iso]] :remote-addr - :req[user] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
});

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
