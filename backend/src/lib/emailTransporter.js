const config = require('config');

module.exports = function() {
  const transporterSelected = config.get('email.transporter');

  if (!transporterSelected) {
    throw Error('Email transporter not defined');
  }


  switch(transporterSelected.toLowerCase()) {
    case 'gmail':
        const smtpTransport = require('nodemailer-smtp-transport');

        if (!(process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD)) {
          throw Error('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
        }

        return smtpTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            }
        });
    break;

    default:
      throw Error('Email transporter not supported');
  }
};