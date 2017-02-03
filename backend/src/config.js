'use strict';

const config = {
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
    proxy: false,
    secureCookie: false,
    secret: process.env.SESSION_SECRET || "i'm a teapot",
    domain: process.env.SESSION_DOMAIN,
  },
  logFormat: '[:date[iso]] :method :url :status :response-time ms - :req[header]',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'ALSO FAKE',
    kinesisEndpoint: 'http://localhost:4567',
  },
  eventAuthToken: process.env.EVENT_AUTH_TOKEN,
};

if (process.env.NODE_ENV === 'production') {
  config.session.proxy = true;
  config.session.secureCookie = true;

  // Let the SDK derive the endpoint from the region
  config.aws.kinesisEndpoint = undefined;

  config.logFormat = '[:date[iso]] :remote-addr - :req[user] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
}

module.exports = config;
