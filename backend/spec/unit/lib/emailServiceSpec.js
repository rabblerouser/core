'use strict';

var emailService = require('../../../src/lib/emailService');
let sinon = require('sinon');
let config = require('config');
let nodemailer = require('nodemailer');

describe('emailService', () => {
    let transportStub;
    let configStub;
    let sendMailSpy;
    let options;

    beforeEach(() => {
        configStub = sinon.stub(config, 'get');

        configStub.withArgs('email.transporter').returns('gmail');
        process.env.EMAIL_USERNAME = 'user';
        process.env.EMAIL_PASSWORD = 'pswd';

        configStub.withArgs('email.sendEmails').returns(true);

        options = {
            from: 'team@rabblerouser.com',
            to: 'somedev@github.com',
            subject: 'Thanks for contributing',
            body: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
        };
    });

    afterEach(() => {
        nodemailer.createTransport.restore();
        config.get.restore();
        delete process.env.EMAIL_USERNAME;
        delete process.env.EMAIL_PASSWORD;
    });

    describe('html email', () => {

        beforeEach(() => {
            transportStub = { sendMail: function(options, callback) { callback(false,true); }};
            sendMailSpy = sinon.spy(transportStub, 'sendMail');
            sinon.stub(nodemailer, 'createTransport').returns(transportStub);
        });

        it('should send html email', () => {
            return emailService.sendHtmlEmail(options)
            .then((result) => {
                expect(sendMailSpy).to.have.been.called;
                expect(sendMailSpy).to.have.been.calledWith({
                    from: 'team@rabblerouser.com',
                    to: ['somedev@github.com'],
                    subject: 'Thanks for contributing',
                    html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                    bcc: undefined
                } , sinon.match.any);
            });
        });

        it('should send reply to if reply to is defined', () => {
            options.replyTo = 'someemail@email.com';

            return emailService.sendHtmlEmail(options)
            .then((result) => {
                expect(sendMailSpy).to.have.been.called;
                expect(sendMailSpy).to.have.been.calledWith({
                    from: 'team@rabblerouser.com',
                    to: ['somedev@github.com'],
                    subject: 'Thanks for contributing',
                    html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                    replyTo: 'someemail@email.com',
                    bcc: undefined
                } , sinon.match.any);
            });
        });

        it('should send with bcc if bcc is defined on the options sent in', () => {
            options.bcc = 'bcc@email.com';

            return emailService.sendHtmlEmail(options)
            .then((result) => {
                expect(sendMailSpy).to.have.been.called;
                expect(sendMailSpy).to.have.been.calledWith({
                    from: 'team@rabblerouser.com',
                    to: ['somedev@github.com'],
                    subject: 'Thanks for contributing',
                    html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                    bcc: ['bcc@email.com']
                } , sinon.match.any);
            });
        });

        it('should set from field to email.defaultEmailAccount if from field is not present', () => {
            configStub.withArgs('email.defaultEmailAccount').returns('email321@23.com');

            options.from = null;

            return emailService.sendHtmlEmail(options)
            .then((result) => {
                expect(sendMailSpy).to.have.been.called;
                expect(sendMailSpy).to.have.been.calledWith({
                    from: 'email321@23.com',
                    to: ['somedev@github.com'],
                    subject: 'Thanks for contributing',
                    html: 'Hey,\nthanks for that PR, do you want some stickers? \nThe team.',
                    bcc: undefined
                }, sinon.match.any);
            });
        });
    });

    describe('things go bad', () => {

        describe('plain text email', () => {
            beforeEach(() => {
                transportStub = { sendMail: function(options, callback) { callback(true,false); }};
                sendMailSpy = sinon.spy(transportStub, 'sendMail');
                sinon.stub(nodemailer, 'createTransport').returns(transportStub);
            });

            it('should fail when there is an unexpected error', (done) => {
                emailService.sendPlainTextEmail(options)
                .then(result => {
                    done.fail('This test should have failed.');
                })
                .catch(error => {
                    expect(error).not.to.be.null;
                    done();
                });
            });

            it('should throw an error if the parameter to is not defined', () => {
                options.to = null;

                emailService.sendPlainTextEmail(options)
                .then(result => {
                    done.fail('This test should have failed.');
                })
                .catch(error => {
                    expect(error).not.to.be.null;
                    expect(error.message).to.equal('Invalid email parameters');
                    done();
                });
            });
        });

    });

});
