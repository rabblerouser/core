'use strict';

const nodemailer = require('nodemailer');
const emailTransporter = require('./emailTransporter');
const Q = require('q');
const config = require('config');

function sendEmail(options) {
  if (!(options && options.to)) {
    deferred.reject('Invalid email parameters');
  }

  const transport = nodemailer.createTransport(emailTransporter());

  const deferred = Q.defer();
  options.from = options.from || config.get('email.defaultEmailAccount');

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


module.exports = {
  sendHtmlEmail
};
