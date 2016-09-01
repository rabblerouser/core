'use strict';
const messagingService = require('../../src/services/messagingService');
const sinon = require('sinon');
const member = { email: 'sherlock@holmes.co.uk' };
const config = require('config');

const nodemailer = require('nodemailer');

describe('Messaging integration tests', () => {
  describe('send welcome email', () => {
    let transportStub;
    let configStub;
    let sendMailSpy;

    beforeEach(() => {
      configStub = sinon.stub(config, 'get');

      configStub.withArgs('email.transporter').returns('gmail');
      process.env.EMAIL_USERNAME = 'user';
      process.env.EMAIL_PASSWORD = 'pswd';

      configStub.withArgs('email.sendEmails').returns(true);
      configStub.withArgs('email.membershipEmail').returns('lhajfhadhaskjhd@rabblerouser.com');
      configStub.withArgs('email.welcome.subject').returns('Welcome text');
      configStub.withArgs('email.welcome.body').returns('Welcome body\nHello world');
    });

    afterEach(() => {
      nodemailer.createTransport.restore();
      config.get.restore();
      delete process.env.EMAIL_USERNAME;
      delete process.env.EMAIL_PASSWORD;
    });

    describe('happy', () => {
      beforeEach(() => {
        transportStub = { sendMail: (options, callback) => callback(false, true) };
        sendMailSpy = sinon.spy(transportStub, 'sendMail');
        sinon.stub(nodemailer, 'createTransport').returns(transportStub);
      });

      it('sends the welcome email to the member', () => {
        return messagingService.sendWelcomeEmail(member)
        .then(() => {
          expect(sendMailSpy).to.have.been.called;
          expect(sendMailSpy).to.have.been.calledWith(sinon.match({
            from: 'lhajfhadhaskjhd@rabblerouser.com',
            to: ['sherlock@holmes.co.uk'],
            subject: 'Welcome text',
            html: 'Welcome body\nHello world',
            replyTo: 'lhajfhadhaskjhd@rabblerouser.com'
          }), sinon.match.any);
        });
      });

      it('does not send an email if disabled in configuration', () => {
        configStub.withArgs('email.sendEmails').returns(false);

        return messagingService.sendWelcomeEmail(member)
        .finally(() => {
          expect(sendMailSpy).not.to.have.been.called;
        });
      });
    });

    describe('sad', () => {
      beforeEach(() => {
        transportStub = { sendMail: function(options, callback) { callback(true,false); }};
        sendMailSpy = sinon.spy(transportStub, 'sendMail');
        sinon.stub(nodemailer, 'createTransport').returns(transportStub);
      });

      it('throws an error when something unexpected happens', (done) => {
        messagingService.sendWelcomeEmail(member)
          .then((result) => {
            done.fail('no error!');
          })
          .catch((error) => {
            expect(error).not.to.be.null;
            done();
          });
      });
    });
  });
});
