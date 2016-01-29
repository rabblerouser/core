'use strict';

let emailUtil = require('../lib/emailUtil');
let sendVerificationEmailEnabled = require('config').get('email.sendMemberVerificationEnabled');
let logger = require('../lib/logger');

function logAndRethrow(error) {
  logger.logError(error.stack, 'sending verification email');
  throw new Error(error);
}

function sendVerificationEmail(member) {

  if (!sendVerificationEmailEnabled) {
    return member;
  }

//should be moved to a separate file.
  const text = `Hello, \m

  Thank you for your membership application to the Pirate Party. \n

  You're almost done! The last step is to verify your membership by clicking on the link below. \n

  <a href="https://validateThis/${member.hash}"'> \n

  Best,\n

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
  .catch(logAndRethrow);
}

module.exports = {
  sendVerificationEmail : sendVerificationEmail
};