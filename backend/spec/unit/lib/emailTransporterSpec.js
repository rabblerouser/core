'use strict';

const emailTransporter = require('../../../src/lib/emailTransporter');
const config = require('../../../src/config');

describe('emailTransporter', () => {
  describe('things go well', () => {
    it('should return the smtp transporter when the transporter setting is set to gmail', () => {
      config.email.transporter = 'gmail';
      config.email.username = 'user';
      config.email.password = 'pswd';

      const transporter = emailTransporter();
      expect(transporter).not.to.be.null;
      expect(transporter.name).to.equals('SMTP');
    });

    it('should return the mailgun transporter when the transporter setting is set to mailgun', () => {
      config.email.transporter = 'mailgun';
      config.email.username = 'user';
      config.email.password = 'pswd';

      const transporter = emailTransporter();
      expect(transporter).not.to.be.null;
      expect(transporter.name).to.equals('SMTP');
    });
  });

  describe('things go bad', () => {
    it('should throw an exception when the transporter setting not defined', () => {
      config.email.transporter = null;
      expect(emailTransporter).to.throw('Email transporter not defined');
    });

    it('should throw an exception when the transporter not supported', () => {
      config.email.transporter = 'nonexistent-email-tool';
      expect(emailTransporter).to.throw('Email transporter not supported');
    });

    it('should throw an exception when the username is not configured', () => {
      config.email.transporter = 'gmail';
      config.email.username = undefined;
      config.email.password = 'pswd';

      expect(emailTransporter).to.throw('Email username and password must both be defined to send emails');
    });

    it('should throw an exception when the password is not configured', () => {
      config.email.transporter = 'gmail';
      config.email.username = 'user';
      config.email.password = undefined;

      expect(emailTransporter).to.throw('Email username and password must both be defined to send emails');
    });
  });
});
