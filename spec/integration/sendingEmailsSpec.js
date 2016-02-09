'use strict';
let specHelper = require('../support/specHelper');
let Q = specHelper.Q;
let emailUtil = require('../../lib/emailUtil');
let messagingService = require('../../services/messagingService');
let sinon = require('sinon');
let member = {email: 'sherlock@holmes.co.uk', verificationHash: 'shhhaaaaaa'};
let config = require('config');

let nodemailer = require('nodemailer');

describe('thing', () => {
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

            it('sends the email to the member', (done) => {
                messagingService.sendVerificationEmail(member)
                    .then((result) => {
                        expect(sendMailSpy).toHaveBeenCalled();
                    })
                    .nodeify(done);
            });

            it('does not send an email if disabled in configuration', (done) => {
                configStub.withArgs('email.sendEmails').returns(false);

                messagingService.sendVerificationEmail(member)
                    .finally(() => {
                        expect(sendMailSpy).not.toHaveBeenCalled();
                    })
                    .nodeify(done);
            });
        });

        describe('sad', () => {

            beforeEach(() => {
                transportStub = { sendMail: function(options, callback) { callback(true,false); }};
                sendMailSpy = sinon.spy(transportStub, 'sendMail');
                sinon.stub(nodemailer, 'createTransport').returns(transportStub);
            });

            it('throws an error when something unexpected happens', (done) => {
                messagingService.sendVerificationEmail(member)
                    .then((result) => {
                        expect("this shouldn't happen").toBe("aahhhh");
                    })
                    .catch((error) => {
                        expect(error).not.toBeNull();
                    })
                    .finally(done);
            });
        });



    });
});