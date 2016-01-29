'use strict';
let specHelper = require('../../support/specHelper');
let Q = specHelper.Q;
let emailUtil = require('../../../lib/emailUtil');
let messagingService = require('../../../services/messagingService');
let sinon = require('sinon');
let member = {email: 'sherlock@holmes.co.uk', verificationHash: 'shhhaaaaaa'};

describe('messagingService', () => {
  describe('sendVerificationEmail', () => {
    let emailUiltStub = sinon.stub(emailUtil, 'sendHtmlEmail');
    let emailPromise;

    beforeEach(() => {
      emailPromise = Q.defer();
      emailUiltStub.returns(emailPromise.promise);
    });

    afterEach(() => {
      emailUtil.sendHtmlEmail.restore();
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