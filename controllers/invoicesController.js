'use strict';

var invoiceService = require("../services/invoiceService");

var newInvoiceHandler = (req, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    let validate = (invoice) => {
      return /^[0-9]*(,?[0-9]+\.?)?[0-9]{0,2}$/.test(invoice.totalAmount);
    };

    let newInvoice = {
        memberEmail: req.body.memberEmail,
        totalAmount: req.body.totalAmount,
        paymentType: req.body.paymentType
    };

    invoiceService.chargeCard(req.body.stripeToken, req.body.totalAmount);

    if (!validate(newInvoice)) {
        return res.status(400).render('members/payment', {title: 'Payment', errors: ["totalAmount"], email: req.body.memberEmail});
    }

    return invoiceService.createInvoice(newInvoice)
        .then(() => {
            res.status(200).render('members/success', {email: req.body.memberEmail});
        })
        .catch(dbError);
};

module.exports = {
    newInvoiceHandler: newInvoiceHandler
};
