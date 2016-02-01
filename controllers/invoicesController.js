'use strict';

var invoiceService = require("../services/invoiceService");
var paymentValidator = require("../lib/paymentValidator");
var ChargeCardError = require('../errors/ChargeCardError');
var logger = require('../lib/logger');

var newInvoiceHandler = (req, res) => {

    let newInvoice = {
        totalAmount: req.body.paymentType === 'noContribute' ? 1 : req.body.totalAmount,
        paymentType: req.body.paymentType,
        stripeToken: req.body.stripeToken,
        invoiceId: req.body.invoiceId
    };

    let validationErrors = paymentValidator.isValid(newInvoice);

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
            logger.logError(error, "Internal Server Error");
            res.status(500).json({errors: "Internal Server Error"});
        }
    }
}

module.exports = {
    newInvoiceHandler: newInvoiceHandler
};
