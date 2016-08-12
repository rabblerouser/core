'use strict';

const nodemailer = require('nodemailer');
const sendmailTransport = require('nodemailer-sendmail-transport');
const Q = require('q');
const config = require('config').email;

const emailConfig = {
  path: config.server,
  args: ['-t'],
};

function sendEmail(options) {
  const transport = nodemailer.createTransport(sendmailTransport(emailConfig));
  const deferred = Q.defer();
  options.from = options.from || `Pirate Party <${config.membershipEmail}>`;

  transport.sendMail(options, (error, result) => {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(result);
    }
  });

  return deferred.promise;
}

const sendHtmlEmail = options => {
  if (!(options && options.to)) {
    throw new Error('Invalid email parameters');
  }

  const to = options.to instanceof Array ? options.to : [options.to];

  const emailOptions = {
    from: options.from,
    to,
    subject: options.subject,
    html: options.body,
  };

  if (options.replyTo) {
    emailOptions.replyTo = options.replyTo;
  }

  return sendEmail(emailOptions);
};


const sendPlainTextEmail = options => {
  const to = options.to instanceof Array ? options.to : [options.to];

  const emailOptions = {
    from: options.from,
    to,
    subject: options.subject,
    text: options.body,
  };

  if (options.replyTo) {
    emailOptions.replyTo = options.replyTo;
  }

  return sendEmail(emailOptions);
};

module.exports = {
  sendHtmlEmail,
  sendPlainTextEmail,
};
