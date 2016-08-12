'use strict';

const emailUtil = require('../lib/emailUtil');
const config = require('config');
const logger = require('../lib/logger');
const Q = require('q');

function logAndRethrow(message) {
  return error => {
    logger.error(message, { error: error.toString() });
    throw new Error(error);
  };
}

const emails = {
  welcome: {
    logger: email => logger.info('[welcome-email-sent]', { email }),
    subject: 'The Pirate Party - Welcome',
    text: () =>
      `Welcome to the Pirate Party!

      You can now start participating and getting involved towards the development of a more secure and transparent Australia.

      For a list of upcoming meetings and discussions, head to pirateparty.org.au

      Best,

      The Pirate Party`,
  },
};

function sendEmail(member, type) {
  if (!config.get('email.sendEmails')) {
    return Q.resolve(member);
  }

  const options = {
    to: member.email,
    subject: type.subject,
    body: type.text(member),
    replyTo: config.get('email.membershipEmail')
  };

  return emailUtil.sendHtmlEmail(options)
    .then(result => ({
      options,
      result,
    }))
    .tap(type.logger)
    .catch(logAndRethrow('[email-failed]'));
}

function sendWelcomeEmail(member) {
  return sendEmail(member, emails.welcome);
}

module.exports = {
  sendWelcomeEmail: sendWelcomeEmail,
};
