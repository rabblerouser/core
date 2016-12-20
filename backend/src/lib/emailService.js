'use strict';

const nodemailer = require('nodemailer');
const emailTransporter = require('./emailTransporter');
const Q = require('q');
const config = require('../config');

function toArray(obj) {
  return obj instanceof Array ? obj : [obj];
}

function sendEmail(options) {
  const deferred = Q.defer();

  if (!options.to) {
    deferred.reject('Invalid email parameters');
    return deferred.promise;
  }

  const transport = nodemailer.createTransport(emailTransporter());

  options.from = options.from || config.email.from;
  options.to = toArray(options.to);

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
  const bcc = options.bcc ? toArray(options.bcc) : options.bcc;

  const emailOptions = {
    from: options.from,
    to: options.to,
    bcc,
    subject: options.subject,
    html: options.body,
  };

  if (options.replyTo) {
    emailOptions.replyTo = options.replyTo;
  }

  return sendEmail(emailOptions);
};


module.exports = {
  sendHtmlEmail,
};
