'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    stripeHandler = require('../lib/stripeHandler'),
    moment = require('moment'),
    Invoice = models.Invoice;


var createInvoice = (newInvoice) => {
  var invoice = {
    memberEmail: newInvoice.memberEmail,
    totalAmountInCents: newInvoice.totalAmount * 100,
    paymentDate: moment().format('L'),
    paymentType: newInvoice.paymentType,
    reference: newInvoice.reference || '',
    paymentStatus: newInvoice.paymentStatus || 'Pending'
  };

  return Q(invoice)
    .then(Invoice.create.bind(Invoice))
    .then(logger.logNewInvoiceEvent(newInvoice))
    .catch((error) => {
        return Q.reject(error);
    });
};

var chargeCard = (stripeToken, totalAmount) => {
    return stripeHandler.chargeCard(stripeToken, totalAmount)
        .tap(() => {
          logger.logNewChargeEvent(stripeToken);
        })
        .catch((error)=>{
          logger.logNewFailedCharge(stripeToken,error);
          return Q.reject("Failed to charge card");
        });
};

module.exports = {
    createInvoice: createInvoice,
    chargeCard: chargeCard
};
