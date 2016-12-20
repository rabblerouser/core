const config = require('../config');
const smtpTransport = require('nodemailer-smtp-transport');

function authConfig() {
  if (!(config.email.username && config.email.password)) {
    throw Error('Email username and password must both be defined to send emails');
  }
  return {
    user: config.email.username,
    pass: config.email.password,
  };
}

function buildGmailTransport() {
  return smtpTransport({
    service: 'gmail',
    auth: authConfig(),
  });
}

function buildMailgunTransport() {
  return smtpTransport({
    host: 'smtp.mailgun.org',
    port: 25,
    auth: authConfig(),
  });
}

module.exports = () => {
  const transporter = config.email.transporter;

  if (!transporter) {
    throw Error('Email transporter not defined');
  }

  switch (transporter.toLowerCase()) {
    case 'gmail':
      return buildGmailTransport();
    case 'mailgun':
      return buildMailgunTransport();

    default:
      throw Error('Email transporter not supported');
  }
};
