'use strict';

var invoiceService = require("../services/invoiceService");

var newInvoiceHandler = (req, res) => {
    let validate = (invoice) => {
        return !isNaN(invoice.totalAmount) && invoice.totalAmount >= 0;
    };

    let newInvoice = {
        memberEmail: req.body.memberEmail,
        totalAmount: req.body.totalAmount,
        paymentType: req.body.paymentType,
        reference: ''
    };


    if (!validate(newInvoice)) {
        return res.status(400).render('members/payment', {
            title: 'Payment',
            errors: ["totalAmount"],
            email: newInvoice.memberEmail
        });
    }

    if (newInvoice.paymentType === "deposit" || newInvoice.paymentType === "cheque") {
        return createInvoice(newInvoice, res);
    }
    if (req.body.paymentType === "stripe" && req.body.stripeToken) {
        invoiceService.chargeCard(req.body.stripeToken.id, req.body.totalAmount)
            .then((charge) => {
                newInvoice.reference = charge.id;
                return createInvoice(newInvoice, res);
            })
            .catch((error) => {
                res.status(400).json({errors: ["Failed to charge card"]});
                return createInvoice(newInvoice, res);
            });
    }
};

var createInvoice = (newInvoice, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    return invoiceService.createInvoice(newInvoice)
        .then(() => {
            res.status(200).render('members/success', {email: newInvoice.memberEmail});
        })
        .catch(dbError);
};

module.exports = {
    newInvoiceHandler: newInvoiceHandler
};
