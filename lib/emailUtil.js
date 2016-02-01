'use strict';
let nodemailer = require('nodemailer');
let Q = require('q');
let config = require('config').email;

var transporter = nodemailer.createTransport({
    pool: true,
    host: config.smtpServer,
    port: 465,
    secure: true,
    auth: {
        user: config.user,
        pass: config.password
    }
});

function sendEmail(options) {
  var deferred = Q.defer();

  options.from = options.from || `Pirate Party <${config.membershipEmail}>`; //Take this from config instead

  transporter.sendMail(options, function(error, info){
      if(error){
          deferred.reject(new Error(error));
      } else {
        deferred.resolve('Message sent: ' + info.response);
      }
  });

  return deferred.promise;
}

var sendHtmlEmail = function (options) {
  let to = options.to instanceof Array ? options.to : [options.to];

  var emailOptions = {
    from: options.from,
    to: to,
    subject: options.subject,
    html: options.body
  };

  return sendEmail(emailOptions);
};


var sendPlainTextEmail = function (options) {
  let to = options.to instanceof Array ? options.to : [options.to];

  var emailOptions = {
    from: options.from,
    to: to,
    subject: options.subject,
    text: options.body
  };

  return sendEmail(emailOptions);
};

module.exports = {
  sendHtmlEmail: sendHtmlEmail,
  sendPlainTextEmail: sendPlainTextEmail
};