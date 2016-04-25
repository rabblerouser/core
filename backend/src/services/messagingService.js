'use strict';

let emailUtil = require('../lib/emailUtil');
let config = require('config');
let logger = require('../lib/logger');
let Q = require('q');

function logAndRethrow(message) {
    return function (error) {
        logger.error(message, {error: error.toString()});
        throw new Error(error);
    };
}

let emails = {
  welcome: {
    logger: (email) => logger.info('[welcome-email-sent]', { email: email }),
    subject: 'The Pirate Party - Welcome',
    text: function() { return `Welcome to the Pirate Party!

        You can now start participating and getting involved towards the development of a more secure and transparent Australia.

        For a list of upcoming meetings and discussions, head to pirateparty.org.au

        Best,

        The Pirate Party`;
    }
  }
};

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
        .catch(logAndRethrow('[email-failed]'));
}

function sendWelcomeEmail(member) {
    return sendEmail(member, emails.welcome);
}


module.exports = {
  sendWelcomeEmail: sendWelcomeEmail
};