'use strict';
let nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');
let Q = require('q');
let config = require('config').email;

let emailConfig = {
  path: config.server,
  args: ['-t']
};

var transporter = nodemailer.createTransport(sendmailTransport(emailConfig));

function sendEmail(options) {
  var deferred = Q.defer();

  options.from = options.from || `Pirate Party <${config.membershipEmail}>`; //Take this from config instead

  transporter.sendMail(options, function(error, result){
      if(error){
          deferred.reject(error);
      } else {
          deferred.resolve(result);
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