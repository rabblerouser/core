'use strict';
const messagingService = require('../../src/services/messagingService');
const sinon = require('sinon');
const member = { email: 'sherlock@holmes.co.uk' };
const config = require('../../src/config');

const nodemailer = require('nodemailer');

describe('Messaging integration tests', () => {
  describe('send welcome email', () => {
    let transportStub;
    let sendMailSpy;

    beforeEach(() => {
      config.email.sendEmails = 'true';
      config.email.transporter = 'gmail';
      config.email.username = 'user';
      config.email.password = 'pswd';
      config.email.replyTo = 'lhajfhadhaskjhd@rabblerouser.com';
      config.email.welcomeSubject = 'Welcome text';
      config.email.welcomeBody = 'Welcome body\nHello world';
    });

    afterEach(() => {
      nodemailer.createTransport.restore();
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
            replyTo: 'lhajfhadhaskjhd@rabblerouser.com',
          }), sinon.match.any);
        });
      });

      it('does not send an email if disabled in configuration', () => {
        config.email.sendEmails = 'false';

        return messagingService.sendWelcomeEmail(member)
        .finally(() => {
          expect(sendMailSpy).not.to.have.been.called;
        });
      });
    });

    describe('sad', () => {
      beforeEach(() => {
        transportStub = { sendMail: (options, callback) => callback(true, false) };
        sendMailSpy = sinon.spy(transportStub, 'sendMail');
        sinon.stub(nodemailer, 'createTransport').returns(transportStub);
      });

      it('throws an error when something unexpected happens', done => {
        messagingService.sendWelcomeEmail(member)
          .then(() => {
            done.fail('no error!');
          })
          .catch(error => {
            expect(error).not.to.be.null;
            done();
          });
      });
    });
  });
});
