'use strict';

var express = require('express');
var router = express.Router();
var membersController = require('../controllers/membersController');
var updateMemberController = require('../controllers/updateMemberController');
var invoicesController = require('../controllers/invoicesController');
var stripeHandler = require('../lib/stripeHandler');
var paypalHandler = require('../lib/paypalHandler');

router.get('/', function(req, res) {
    res.header({
      'Stripe-Public-Key': stripeHandler.getPublicKey(),
      'Paypal-Server-Url': paypalHandler.getServerUrl(),
      'Paypal-Return-Url': paypalHandler.getReturnUrl(),
      'Paypal-Email': paypalHandler.getPaypalEmail()
    }).render('index', { title: 'Pirate Party Membership' });
});

router.get('/members/new', function(req, res) {
    res.render('members/new', { title: 'New Member' });
});

router.post('/payments/paypal', paypalHandler.handleIpn);

router.post('/members', membersController.newMemberHandler);
router.post('/members/update', updateMemberController.updateMemberHandler);
router.post('/invoices', invoicesController.newInvoiceHandler);

module.exports = router;
