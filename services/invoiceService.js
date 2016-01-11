'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    Invoice = models.Invoice;

var stripe = require("stripe")("pk_test_4SqBME7pIDAKSWRft4OpviYK");

var createInvoice = (newInvoice) => {
  return Q({
    memberEmail: newInvoice.memberEmail,
    totalAmountInCents: parseFloat(newInvoice.totalAmount) * 100,
    paymentDate: moment().format('L'),
    paymentType: newInvoice.paymentType,
    reference: ''
  })
    .then(Invoice.create.bind(Invoice))
    .then(logger.logNewInvoiceEvent(newInvoice))
    .catch((error) => {
        return Q.reject(error);
    });
};

var chargeCard = (stripeToken, totalAmount) => {
  stripe.charges.create({
    amount: parseFloat(totalAmount) * 100,
    currency: "aud",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      // TODO: Handle charge card error
    }
  });
};

module.exports = {
    createInvoice: createInvoice,
    chargeCard: chargeCard
};
