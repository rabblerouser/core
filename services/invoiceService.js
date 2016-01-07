'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    Invoice = models.Invoice;

var createInvoice = (newInvoice) => {
  return Q({
    memberEmail: newInvoice.memberEmail,
    totalAmount: parseFloat(newInvoice.totalAmount) * 100,
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

module.exports = {
    createInvoice: createInvoice
};
