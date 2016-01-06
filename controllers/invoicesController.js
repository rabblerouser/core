'use strict';

var invoiceService = require("../services/invoiceService");

var newInvoiceHandler = (req, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    let newInvocie = {
        memberEmail: req.body.email,
        totalAmount: req.body.amount,
        paymentType: req.body.paymentType
    };

    return invoiceService.createInvoice(newInvocie);
};

module.exports = {
    newInvoiceHandler: newInvoiceHandler
};
