'use strict';

const Q = require("q"),
    models = require('../models'),
    logger = require('../lib/logger'),
    stripeHandler = require('../lib/stripeHandler'),
    moment = require('moment'),
    Invoice = models.Invoice;

var updateInvoice = (invoiceId, newInvoice) => {
    var invoice = {
      totalAmountInCents: newInvoice.totalAmount * 100,
      paymentDate: moment().format('L'),
      paymentType: newInvoice.paymentType,
      paymentStatus: newInvoice.paymentStatus || 'Pending'
    }

    if (newInvoice.paymentType == "stripe") {
      invoice.reference = newInvoice.reference;
    }

    return Q(invoice)
        .then(()=>{ return Invoice.update(invoice, { where: {id: invoiceId} }) })
        .tap(()=>{logger.logUpdateInvoiceEvent(invoiceId, invoice)});
}

var createNewInvoice = (newInvoice) => {
    var invoice = {
      memberEmail: newInvoice.memberEmail,
      totalAmountInCents: newInvoice.totalAmount * 100,
      paymentDate: moment().format('L'),
      paymentType: newInvoice.paymentType,
      reference: getReferenceNumber(newInvoice),
      paymentStatus: newInvoice.paymentStatus || 'Pending'
    }

    return Q(invoice)
        .then(Invoice.create.bind(Invoice))
        .tap(()=>{logger.logNewInvoiceEvent(invoice)});
}


var createInvoice = (newInvoice) => {
    return Q(newInvoice)
        .then(()=>{ return Invoice.findById(newInvoice.invoiceId)})
        .then((invoice) => {
            if (invoice) {
                return updateInvoice(invoice.dataValues.id, newInvoice);
            }
            else {
                return createNewInvoice(newInvoice);
            }
        })
        .catch((error) => {
            return Q.reject(error);
        });
};

var getReferenceNumber = (newInvoice) => {
  if (newInvoice.paymentType === "stripe"){
      return newInvoice.reference;
  }
  else {
      return newInvoice.membershipType.substring(0,3).toUpperCase() + newInvoice.uuid;
  }
}

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

var createEmptyInvoice = (memberEmail, reference) => {
    return Q({
          memberEmail: memberEmail,
          totalAmountInCents: 0,
          paymentDate: moment().format('L'),
          paymentType: '',
          reference: reference,
          paymentStatus: ''
        })
        .then(Invoice.create.bind(Invoice))
        .tap(()=>{logger.logCreateEmptyInvoiceEvent(memberEmail, reference)})
        .catch((error) => {
          return Q.reject(error);
        });
}

var paypalChargeSuccess = (customInvoiceId, paypalId) => {
    return models.sequelize.transaction(function (t) {
        return Invoice.update({
          reference: paypalId,
          "paymentStatus": 'PAID'
        },{
          where: {id : customInvoiceId}
        }, {transaction: t}
        ).tap((value) => {
            logger.logNewPaypalUpdate(customInvoiceId, paypalId);
        }).then((value) => {
            if(!value || value[0] != 1) {
                logger.logNewFailedPaypalUpdate(customInvoiceId, paypalId);
                return Q.reject("Failed to update " + customInvoiceId + " in the database");
            }
        });
    }).catch((err) => {
        return Q.reject(err);
    });
};

module.exports = {
    createInvoice: createInvoice,
    chargeCard: chargeCard,
    createEmptyInvoice: createEmptyInvoice,
    paypalChargeSuccess: paypalChargeSuccess
};
