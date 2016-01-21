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
        res.status(200);
        return createInvoice(newInvoice, res);
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
