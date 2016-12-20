'use strict';

const emailService = require('../../../src/lib/emailService');
const sinon = require('sinon');
const config = require('../../../src/config');
const nodemailer = require('nodemailer');

describe('emailService', () => {
  let transportStub;
  let sendMailSpy;
  let options;

  beforeEach(() => {
    config.email.sendEmails = 'true';
    config.email.transporter = 'gmail';
    config.email.username = 'user';
    config.email.password = 'pswd';

    options = {
      from: 'team@rabblerouser.com',
      to: 'somedev@github.com',
      subject: 'Thanks for contributing',
      body: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
    };
  });

  afterEach(() => {
    nodemailer.createTransport.restore();
  });

  describe('html email', () => {
    beforeEach(() => {
      transportStub = { sendMail: (opt, callback) => callback(false, true) };
      sendMailSpy = sinon.spy(transportStub, 'sendMail');
      sinon.stub(nodemailer, 'createTransport').returns(transportStub);
    });

    it('should send html email', () => {
      return emailService.sendHtmlEmail(options)
            .then(() => {
              expect(sendMailSpy).to.have.been.called;
              expect(sendMailSpy).to.have.been.calledWith({
                from: 'team@rabblerouser.com',
                to: ['somedev@github.com'],
                subject: 'Thanks for contributing',
                html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                bcc: undefined,
              }, sinon.match.any);
            });
    });

    it('should send reply to if reply to is defined', () => {
      options.replyTo = 'someemail@email.com';

      return emailService.sendHtmlEmail(options)
            .then(() => {
              expect(sendMailSpy).to.have.been.called;
              expect(sendMailSpy).to.have.been.calledWith({
                from: 'team@rabblerouser.com',
                to: ['somedev@github.com'],
                subject: 'Thanks for contributing',
                html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                replyTo: 'someemail@email.com',
                bcc: undefined,
              }, sinon.match.any);
            });
    });

    it('should send with bcc if bcc is defined on the options sent in', () => {
      options.bcc = 'bcc@email.com';

      return emailService.sendHtmlEmail(options)
            .then(() => {
              expect(sendMailSpy).to.have.been.called;
              expect(sendMailSpy).to.have.been.calledWith({
                from: 'team@rabblerouser.com',
                to: ['somedev@github.com'],
                subject: 'Thanks for contributing',
                html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                bcc: ['bcc@email.com'],
              }, sinon.match.any);
            });
    });

    it('should set from field to config.email.from if from field is not present', () => {
      config.email.from = 'email321@23.com';
      options.from = null;

      return emailService.sendHtmlEmail(options)
            .then(() => {
              expect(sendMailSpy).to.have.been.called;
              expect(sendMailSpy).to.have.been.calledWith({
                from: 'email321@23.com',
                to: ['somedev@github.com'],
                subject: 'Thanks for contributing',
                html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                bcc: undefined,
              }, sinon.match.any);
            });
    });
  });

  describe('things go bad', () => {
    describe('plain html email', () => {
      beforeEach(() => {
        transportStub = { sendMail: (opt, callback) => callback(true, false) };
        sendMailSpy = sinon.spy(transportStub, 'sendMail');
        sinon.stub(nodemailer, 'createTransport').returns(transportStub);
      });

      it('should fail when there is an unexpected error', done => {
        emailService.sendHtmlEmail(options)
                .then(() => {
                  done.fail('This test should have failed.');
                })
                .catch(error => {
                  expect(error).not.to.be.null;
                  done();
                });
      });

      it('should throw an error if the parameter to is not defined', done => {
        options.to = null;

        emailService.sendHtmlEmail(options)
                .then(() => {
                  done.fail('This test should have failed.');
                })
                .catch(error => {
                  expect(error).not.to.be.null;
                  expect(error).to.equal('Invalid email parameters');
                  done();
                });
      });
    });
  });
});
