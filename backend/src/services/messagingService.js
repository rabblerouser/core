'use strict';

const emailService = require('../lib/emailService');
const adminService = require('./adminService');
const config = require('../config');
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
  if (config.email.sendEmails !== 'true') {
    return Q.resolve(member);
  }

  const content = {
    logger: email => logger.info('[welcome-email-sent]', { email }),
    subject: config.email.welcomeSubject,
    text: config.email.welcomeBody,
  };

  return adminService
    .admins(member.branchId)
    .then(admins => admins.map(admin => admin.email))
    .then(bcc => sendEmail(member.email, bcc, content, config.email.replyTo));
}

module.exports = {
  sendWelcomeEmail,
};
