'use strict';
let messagingService = require('../../../src/services/messagingService');
let sinon = require('sinon');
let member = {email: 'sherlock@holmes.co.uk'};
let config = require('config');

let nodemailer = require('nodemailer');

describe('Email Integration tests', () => {
    describe('sending emails', () => {
        let transportStub;
        let configStub;
        let sendMailSpy;

        beforeEach(() => {
            configStub = sinon.stub(config, 'get');
            configStub.withArgs('email.sendEmails').returns(true);
        });

        afterEach(() => {
            nodemailer.createTransport.restore();
            config.get.restore();
        });

        describe('happy', () => {
            beforeEach(() => {
                transportStub = { sendMail: function(options, callback) { callback(false,true); }};
                sendMailSpy = sinon.spy(transportStub, 'sendMail');
                sinon.stub(nodemailer, 'createTransport').returns(transportStub);
            });

            it('sends the email to the member', () => {
                return messagingService.sendWelcomeEmail(member)
                .then((result) => {
                    expect(sendMailSpy).to.have.been.called;
                    expect(sendMailSpy).to.have.been.calledWith(sinon.match({
                        from: sinon.match.string,
                        to: ['sherlock@holmes.co.uk'],
                        subject: 'The Pirate Party - Welcome',
                        html: sinon.match.string,
                      }) , sinon.match.any);
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
