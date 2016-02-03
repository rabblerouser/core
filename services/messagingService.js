'use strict';

let emailUtil = require('../lib/emailUtil');
let config = require('config');
let logger = require('../lib/logger');
let Q = require('q');

function logAndRethrow(error) {
  logger.logError(error, '[verification-email-failed]');
  throw new Error(error);
}

function sendVerificationEmail(member) {
  if (!config.get('email.sendMemberVerificationEnabled')) {
    return Q.resolve(member);
  }

//should be moved to a separate file.
  const text = `Hello, <br>

  Thank you for your membership application to the Pirate Party. <br>

  You're almost done! The last step is to verify your membership by clicking on the link below. <br>

  <a href="${config.app.publicUrl}/members/verify/${member.verificationHash}">Verify Account</a> <br>

  Best,<br>

  The Pirate Party`;

  let options = {
    to: member.email,
    subject: 'The Pirate Party - Verify Your Email',
    body: text
  };

  return emailUtil.sendHtmlEmail(options)
  .then((result) => {
    return {
      options: options,
      message: result
    };
  })
  .tap(logger.logVerificationEmailSent)
  .catch(logAndRethrow);
}

module.exports = {
  sendVerificationEmail : sendVerificationEmail
};