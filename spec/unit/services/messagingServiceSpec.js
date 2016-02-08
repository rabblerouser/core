'use strict';
let specHelper = require('../../support/specHelper');
let Q = specHelper.Q;
let emailUtil = require('../../../lib/emailUtil');
let logger = require('../../../lib/logger');
let messagingService = require('../../../services/messagingService');
let sinon = require('sinon');
let member = {email: 'sherlock@holmes.co.uk', verificationHash: 'shhhaaaaaa'};
let config = require('config');

describe('messagingService', () => {
  describe('sendVerificationEmail', () => {
    let emailUiltStub;
    let emailPromise;
    let configStub;
    let loggerSpy;

    beforeEach(() => {
      loggerSpy = sinon.spy(logger, 'logError');

      configStub = sinon.stub(config, 'get');
      configStub.withArgs('email.sendEmails').returns(true);

      emailPromise = Q.defer();
      emailUiltStub = sinon.stub(emailUtil, 'sendHtmlEmail');
      emailUiltStub.returns(emailPromise.promise);
    });

    afterEach(() => {
      emailUtil.sendHtmlEmail.restore();
      config.get.restore();
      logger.logError.restore();
    });

    it('sends the email to the member', (done) => {
      emailPromise.resolve('sent');

      messagingService.sendVerificationEmail(member)
      .then((result) => {
        expect(result.message).toEqual('sent');
        expect(result.options.to).toEqual('sherlock@holmes.co.uk');
        expect(emailUtil.sendHtmlEmail).toHav eBeenCalled();
      })
      .nodeify(done);
    });

    it('throws an error when something unexpected happens', (done) => {
      emailPromise.reject('wrong password');

      messagingService.sendVerificationEmail(member)
      .catch((error) => {
        expect(error).not.toBeNull();
        expect(logger.logError).toHaveBeenCalled();
      })
      .nodeify(done);
    });

    it('does not send an email if disabled in configuration', (done) => {
      configStub.withArgs('email.sendEmails').returns(false);

      messagingService.sendVerificationEmail(member)
      .finally(() => {
        expect(emailUtil.sendHtmlEmail).not.toHaveBeenCalled();
        expect(loggerSpy).not.toHaveBeenCalled();
      })
      .nodeify(done);
    });
  });
});