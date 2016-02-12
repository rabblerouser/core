'use strict';

var invoiceService = require("../services/invoiceService");
var paymentValidator = require("../lib/paymentValidator");
var ChargeCardError = require('../errors/ChargeCardError');
var logger = require('../lib/logger');

var updateInvoiceHandler = (req, res) => {

    let newInvoice = {
        totalAmount: req.body.paymentType === 'noContribute' ? 0 : req.body.totalAmount,
        paymentType: req.body.paymentType,
        stripeToken: req.body.stripeToken,
        invoiceId: req.body.invoiceId
    };
    let validationErrors;
    if(req.body.paymentType === 'noContribute'){
        validationErrors = paymentValidator.isValidNoContribute(newInvoice);
    } else {
        validationErrors = paymentValidator.isValid(newInvoice);
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors});
    }

    return invoiceService.payForInvoice(newInvoice)
        .then(sendResponseToUser(res))
        .catch(handleError(res));
};

function sendResponseToUser(res) {
    return function() {
        res.status(200).json({});
    }
}

function handleError(res) {
    return function(error) {
        if (error instanceof ChargeCardError) {
            res.status(400).json({errors: error.message})
        } else {
            logger.logError('invoicesController', error);
            res.status(500).json({errors: "An error has occurred internally."});
        }
    }
}

function confirmPayment(req, res, id) {
    console.log('THIS IS THE ID', id);
    return res.status(200).json({});
}

module.exports = {
    updateInvoiceHandler: updateInvoiceHandler,
    confirmPayment: confirmPayment
};
