'use strict';
let specHelper = require('../../support/specHelper');
let Q = specHelper.Q;
let emailUtil = require('../../../lib/emailUtil');
let messagingService = require('../../../services/messagingService');
let sinon = require('sinon');
let member = {email: 'sherlock@holmes.co.uk', verificationHash: 'shhhaaaaaa'};
let config = require('config');

describe('messagingService', () => {
  describe('sendVerificationEmail', () => {
    let emailUiltStub = sinon.stub(emailUtil, 'sendHtmlEmail');
    let emailPromise;
    let configStub = sinon.stub(config, 'get');

    beforeEach(() => {
      emailPromise = Q.defer();
      emailUiltStub.returns(emailPromise.promise);
      configStub.withArgs('email.sendMemberVerificationEnabled').returns(true);
    });

    afterEach(() => {
      emailUtil.sendHtmlEmail.restore();
      config.get.restore();
    });

    it('sends the email to the member', (done) => {
      emailPromise.resolve('sent');

      messagingService.sendVerificationEmail(member)
      .then((result) => {
        expect(result.message).toEqual('sent');
        expect(result.options.to).toEqual('sherlock@holmes.co.uk');
        expect(emailUtil.sendHtmlEmail).toHaveBeenCalled();
      })
      .nodeify(done);
    });

    it('throws an error when something unexpected happens');

    it('does not send an error if disabled in configuration');
  });
});