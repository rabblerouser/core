'use strict';

var express = require('express');
var router = express.Router();
var membersController = require('../controllers/membersController');
var updateMemberController = require('../controllers/updateMemberController');
var invoicesController = require('../controllers/invoicesController');
var stripeHandler = require('../lib/stripeHandler');
var paypalHandler = require('../lib/paypalHandler');

router.get('/', function(req, res) {
    let headers = Object.assign({}, stripeHandler.getStripeHeaders(), paypalHandler.getPaypalHeaders());
    res.header(headers).render('index', { title: 'Pirate Party Membership' });
});

router.get('/members/new', function(req, res) {
    res.render('members/new', { title: 'New Member' });
});

router.post('/payments/paypal', paypalHandler.handleIpn);

router.post('/members', membersController.newMemberHandler);
router.get('/members/verify/:email/:hash', membersController.verify);

router.get('/verified', function(req, res) {
    res.render('account-verified', { title: 'Pirate Party Membership' });
});

router.post('/members/update', updateMemberController.updateMemberHandler);
router.post('/invoices', invoicesController.newInvoiceHandler);

module.exports = router;
