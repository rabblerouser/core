'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    stripeHandler = require('../lib/stripeHandler'),
    moment = require('moment'),
    Invoice = models.Invoice;

function updatePaymentForInvoice(newInvoice) {
    var updateFields = {
      totalAmountInCents: newInvoice.totalAmount * 100,
      paymentDate: moment().format('L'),
      paymentType: newInvoice.paymentType,
      paymentStatus: newInvoice.paymentStatus || 'Pending'
    };

    if (newInvoice.paymentType === 'stripe') {
      updateFields.transactionId = newInvoice.transactionId;
    }

    return Q(updateFields)
        .then(updateInvoice(newInvoice.id))
        .tap(()=>{logger.logUpdateInvoiceEvent(newInvoice.id, updateFields)});
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
            .tap(()=>{logger.logUpdateInvoiceEvent(invoiceId, updateFields)});
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
            return Q.reject('Failed to charge card');
        });
}

var payForInvoice = (newInvoice) => {
    if (newInvoice.paymentType === "stripe") {
        return chargeCard(newInvoice.stripeToken, newInvoice.totalAmount)
            .then((charge) => {
                newInvoice.paymentStatus = "PAID";
                newInvoice.transactionId = charge.id;
                return updatePaymentForInvoice(newInvoice);
            })
            .catch((error) => {
                return Q.reject(error);
            })
    } else {
        return updatePaymentForInvoice(newInvoice)
            .catch((error) => {
                return Q.reject(error);
            });
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
