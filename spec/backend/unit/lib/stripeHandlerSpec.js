'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      Q = specHelper.Q;

describe('stripeHandler', () => {

  let createStub, stripe,
      stripeToken, totalAmount,
      expectedNewCharge, createPromise,
      stripeHandler;


  beforeEach(() => {
    createStub = sinon.stub();

    stripe = require('stripe');
    sinon.stub(stripe, 'Stripe')
        .returns({charges: {create: createStub}});

    stripeHandler = require('../../../../src/backend/lib/stripeHandler');

    stripeToken = { id:1 };
    totalAmount = 60;
    expectedNewCharge = {
          amount: 6000,
          currency: 'aud',
          source: 1,
          description: 'Pirate party membership.'
        };

    createPromise = Q.defer();
    createStub.returns(createPromise.promise);
  });

  afterEach(() => {
      stripe.Stripe.restore();
  });

  it('Charge Credit Card', (done) => {
      createPromise.resolve();

      stripeHandler.chargeCard(stripeToken, totalAmount)
        .then(() => {
            expect(createStub).toHaveBeenCalledWith(expectedNewCharge);
          }).then(done, done.fail);
  });
});
