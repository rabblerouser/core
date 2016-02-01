'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    stripeHandler = require('../lib/stripeHandler'),
    ChargeCardError = require('../errors/ChargeCardError'),
    moment = require('moment'),
    Invoice = models.Invoice;

function updatePaymentForInvoice(invoice) {
    var updateFields = {
      totalAmountInCents: invoice.totalAmount * 100,
      paymentDate: moment().format('L'),
      paymentType: invoice.paymentType,
      paymentStatus: invoice.paymentStatus || 'Pending'
    };

    if (invoice.paymentType === 'stripe') {
      updateFields.transactionId = invoice.transactionId;
    }

    return Q(updateFields)
        .then(updateInvoice(invoice.invoiceId))
        .tap(()=>{logger.logUpdateInvoiceEvent(invoice.invoiceId, updateFields)});
}

var createEmptyInvoice = (memberEmail, membershipType) => {
    return Q({
          memberEmail: memberEmail,
          totalAmountInCents: 0,
          paymentDate: moment().format('L'),
          paymentType: '',
          reference: ''
        })
        .then(Invoice.create.bind(Invoice))
        .tap(logger.logCreateEmptyInvoiceEvent)
        .then(updateInvoiceReference(membershipType))
        .catch((error) => {
          return Q.reject(error);
        });
};

function updateInvoiceReference(membershipType) {
    return function(data) {
        let invoiceId = data.dataValues.id;
        let updateFields = {
            reference: membershipType.substring(0,3).toUpperCase() + invoiceId
        };

        return Q(updateFields)
            .then(updateInvoice(invoiceId))
            .tap(()=>{logger.logUpdateInvoiceEvent(invoiceId, updateFields)})
            .then(()=>{return {id: invoiceId}});
    }
}

function updateInvoice(invoiceId) {
    return function(updateFields) {
        return Invoice.update(updateFields, { where: {id: invoiceId} });
    }
}

function chargeCard(stripeToken, totalAmount) {
    return stripeHandler.chargeCard(stripeToken, totalAmount)
        .tap(() => {
            logger.logNewChargeEvent(stripeToken);
        })
        .catch((error)=>{
            logger.logNewFailedCharge(stripeToken,error);
            throw new ChargeCardError("Failed to charge card!");
        });
}

function updateStripePaymentForInvoice(invoice) {
    return function(charge) {
        invoice.paymentStatus = "PAID";
        invoice.transactionId = charge.id;
        return updatePaymentForInvoice(invoice);
    }
}

var payForInvoice = (invoice) => {
    if (invoice.paymentType === "stripe") {
        return chargeCard(invoice.stripeToken, invoice.totalAmount)
            .then(updateStripePaymentForInvoice(invoice));
    } else {
        return updatePaymentForInvoice(invoice);
    }
};

var paypalChargeSuccess = (customInvoiceId, paypalId) => {
    function checkResultOfUpdate(value) {
        if(!value || value[0] !== 1) {
            logger.logNewFailedPaypalUpdate(customInvoiceId, paypalId);
            return Q.reject('Failed to update ' + customInvoiceId + ' in the database');
        }
    }

    function logUpdate() {
        logger.logNewPaypalUpdate(customInvoiceId, paypalId);
    }

    return models.sequelize.transaction(function (t) {
        return Invoice.update({
          transactionId: paypalId,
          'paymentStatus': 'PAID'
        },{
          where: {id : customInvoiceId}
        }, {transaction: t})
        .tap(logUpdate)
        .then(checkResultOfUpdate);
    }).catch((err) => {
        return Q.reject(err);
    });
};

module.exports = {
    payForInvoice: payForInvoice,
    createEmptyInvoice: createEmptyInvoice,
    paypalChargeSuccess: paypalChargeSuccess
};
