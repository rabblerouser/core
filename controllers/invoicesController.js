'use strict';

var invoiceService = require("../services/invoiceService");

var newInvoiceHandler = (req, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    let newInvoice = {
        memberEmail: req.body.memberEmail,
        totalAmount: req.body.totalAmount,
        paymentType: req.body.paymentType
    };

    return invoiceService.createInvoice(newInvoice)
        .then(() => {
            res.status(200).render('members/finish');
        })
        .catch(dbError);
};

module.exports = {
    newInvoiceHandler: newInvoiceHandler
};
