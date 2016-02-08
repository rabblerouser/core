'use strict';

let emailUtil = require('../lib/emailUtil');
let config = require('config');
let logger = require('../lib/logger');
let Q = require('q');

function logAndRethrow(error) {
  logger.logError(error, '[verification-email-failed]');
  throw new Error(error);
}

let member = {};

let emails = {
  welcome: {
    logger: logger.logWelcomeEmailSent,
    subject: 'The Pirate Party - Welcome',
    text: function(member) { return `Welcome to the Pirate Party!

You can now start participating and getting involved towards the development of a more secure and transparent Australia.

For a list of upcoming meetings and discussions, head to pirateparty.org.au

Best,

The Pirate Party` }
  },

  verification: {
    logger: logger.logVerificationEmailSent,
    subject: 'The Pirate Party - Verify Your Email',
    text: function(member) { return `Hello, <br>

Thank you for your membership application to the Pirate Party. <br>

You're almost done! The last step is to verify your membership by clicking on the link below. <br>

<a href="${config.app.publicUrl}/members/verify/${member.verificationHash}">Verify Account</a> <br>

Best,<br>

The Pirate Party` }
  }
};

function sendVerificationEmail(member) {
    return sendEmail(member, emails.verification);
}

function sendWelcomeEmail(member) {
    return sendEmail(member, emails.welcome);
}

function sendEmail(member, type) {
    if (!config.get('email.sendEmails')) {
        return Q.resolve(member);
    }

    let options = {
        to: member.email,
        subject: type.subject,
        body: type.text(member)
    };

    return emailUtil.sendHtmlEmail(options)
        .then((result) => {
            return {
                options: options,
                message: result
            };
        })
        .tap(type.logger)
        .catch(logAndRethrow);
}

module.exports = {
  sendVerificationEmail : sendVerificationEmail,
  sendWelcomeEmail: sendWelcomeEmail
};