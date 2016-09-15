const config = require('config');
const smtpTransport = require('nodemailer-smtp-transport');

function buildGmailTransport() {
  if (!(process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD)) {
    throw Error('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
  }

  return smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

function buildMailgunTransport() {
  if (!(process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD)) {
    throw Error('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
  }

  return smtpTransport({
    host: 'smtp.mailgun.org',
    port: 25,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

module.exports = function () {
  const transporterSelected = config.get('email.transporter');

  if (!transporterSelected) {
    throw Error('Email transporter not defined');
  }

  switch (transporterSelected.toLowerCase()) {
    case 'gmail':
      return buildGmailTransport();
    case 'mailgun':
      return buildMailgunTransport();

    default:
      throw Error('Email transporter not supported');
  }
};
