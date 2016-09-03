'use strict';

const emailService = require('../lib/emailService');
const adminService = require('./adminService');
const config = require('config');
const logger = require('../lib/logger');
const Q = require('q');

function logAndRethrow(message) {
  return error => {
    logger.error(message, { error: error.toString() });
    throw new Error(error);
  };
}

function sendEmail(to, bcc, content, replyTo) {
  const options = {
    from: replyTo,
    to,
    bcc,
    subject: content.subject,
    body: content.text,
    replyTo,
  };

  return emailService.sendHtmlEmail(options)
    .then(result => ({
      options,
      result,
    }))
    .tap(content.logger)
    .catch(logAndRethrow('[email-failed]'));
}

function sendWelcomeEmail(member) {
  if (!config.get('email.sendEmails')) {
    return Q.resolve(member);
  }

  const content = {
    logger: email => logger.info('[welcome-email-sent]', { email }),
    subject: config.get('email.welcome.subject'),
    text: config.get('email.welcome.body'),
  };

  return adminService
    .admins(member.branchId)
    .then(admins => admins.map(admin => admin.email))
    .then(bcc => sendEmail(member.email, bcc, content, config.get('email.membershipEmail')));
}

module.exports = {
  sendWelcomeEmail,
};
