'use strict';

var invoiceService = require("../services/invoiceService");
var paymentValidator = require("../lib/paymentValidator");

var newInvoiceHandler = (req, res) => {

    let newInvoice = {
        memberEmail: req.body.memberEmail,
        totalAmount: req.body.paymentType === 'noContribute' ? 1 : req.body.totalAmount,
        paymentType: req.body.paymentType
    };

    let validationErrors = paymentValidator.isValid(newInvoice);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors});
    }

    if (req.body.paymentType === "stripe" && req.body.stripeToken) {
        newInvoice.totalAmount = Math.floor(req.body.totalAmount);

        invoiceService.chargeCard(req.body.stripeToken.id, newInvoice.totalAmount)
            .then((charge) => {
                newInvoice.reference = charge.id;
                newInvoice.paymentStatus = 'Paid';
                res.status(200);
                return createInvoice(newInvoice, res);
            })
            .catch((error) => {
                newInvoice.paymentStatus = 'Pending';
                res.status(400).json({errors: error});
                return createInvoice(newInvoice, res);
            });
    } else {
        res.status(200);
        return createInvoice(newInvoice, res);
    }
};

var createInvoice = (newInvoice, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    return invoiceService.createInvoice(newInvoice)
        .then(() => {
            return res.end();
        })
        .catch(dbError);
};

module.exports = {
    newInvoiceHandler: newInvoiceHandler
};
