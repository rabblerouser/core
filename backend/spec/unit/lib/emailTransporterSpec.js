'use strict';

const emailTransporter = require('../../../src/lib/emailTransporter');
const sinon = require('sinon');
const config = require('config');

describe('emailTransporter', () => {
  let configStub;

  beforeEach(() => {
    configStub = sinon.stub(config, 'get');
  });

  afterEach(() => {
    config.get.restore();
    delete process.env.EMAIL_USERNAME;
    delete process.env.EMAIL_PASSWORD;
  });

  describe('things go well', () => {
    it('should return the smtp transporter when the transporter setting is set to gmail', () => {
      configStub.withArgs('email.transporter').returns('gmail');
      process.env.EMAIL_USERNAME = 'user';
      process.env.EMAIL_PASSWORD = 'pswd';

      const transporter = emailTransporter();
      expect(transporter).not.to.be.null;
      expect(transporter.name).to.equals('SMTP');
    });

    it('should return the mailgun transporter when the transporter setting is set to mailgun', () => {
      configStub.withArgs('email.transporter').returns('mailgun');
      process.env.EMAIL_USERNAME = 'user';
      process.env.EMAIL_PASSWORD = 'pswd';

      const transporter = emailTransporter();
      expect(transporter).not.to.be.null;
      expect(transporter.name).to.equals('SMTP');
    });

  });

  describe('things go bad', () => {
    it('should throw an exception when the transporter setting not defined', () => {
      configStub.withArgs('email.transporter').returns(null);
      expect(emailTransporter).to.throw('Email transporter not defined');
    });

    it('should throw an exception when the transporter not supported', () => {
      configStub.withArgs('email.transporter').returns('nonexistant-email-tool');
      expect(emailTransporter).to.throw('Email transporter not supported');
    });

    describe('gmail', () => {
      it('should throw an exception when the env var EMAIL_USERNAME not defined', () => {
        configStub.withArgs('email.transporter').returns('gmail');
        process.env.EMAIL_PASSWORD = 'pswd';

        expect(emailTransporter).to.throw('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
      });

      it('should throw an exception when the env var EMAIL_PASSWORD not defined', () => {
        configStub.withArgs('email.transporter').returns('gmail');
        process.env.EMAIL_USERNAME = 'user';

        expect(emailTransporter).to.throw('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
      });
    });

    describe('mailgun', () => {
      it('should throw an exception when the env var EMAIL_USERNAME not defined', () => {
        configStub.withArgs('email.transporter').returns('mailgun');
        process.env.EMAIL_PASSWORD = 'pswd';

        expect(emailTransporter).to.throw('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
      });

      it('should throw an exception when the env var EMAIL_PASSWORD not defined', () => {
        configStub.withArgs('email.transporter').returns('mailgun');
        process.env.EMAIL_USERNAME = 'user';

        expect(emailTransporter).to.throw('Environment vars EMAIL_USERNAME and EMAIL_PASSWORD are not defined');
      });
    });
  });
});
