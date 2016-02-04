'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var membersController = require('../controllers/membersController');
var adminController = require('../controllers/adminController');
var invoicesController = require('../controllers/invoicesController');
var stripeHandler = require('../lib/stripeHandler');
var paypalHandler = require('../lib/paypalHandler');

function requireAuth(req, res, next){
    if(!req.isAuthenticated()){
        req.session.messages = "You need to login to view this page";
        res.redirect('/login');
    }
    next();
}

router.get('/', function(req, res) {
    let headers = Object.assign({}, stripeHandler.getStripeHeaders(), paypalHandler.getPaypalHeaders());
    res.header(headers).render('index', { title: 'Pirate Party Membership' });
});

router.get('/members/new', function(req, res) {
    res.render('members/new', { title: 'New Member' });
});

router.post('/payments/paypal', paypalHandler.handleIpn);

router.post('/members', membersController.newMemberHandler);
router.post('/renew', membersController.renewMemberHandler);
router.get('/members/verify/:hash', membersController.verify);
router.get('/members/verify/:email/:hash', membersController.verify);
router.get('/members/renew/:hash', membersController.renew);

router.get('/verified', function(req, res) {
    res.render('account-verified', { title: 'Pirate Party Membership' });
});

router.post('/members/update', membersController.updateMemberHandler);
router.post('/invoices/update', invoicesController.updateInvoiceHandler);

router.get('/members', requireAuth, adminController.membersList);

router.post('/login',
  passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);

router.get('/login', function(req, res){
    res.render('login');
});

router.get('/logout', requireAuth, function(req, res){
    req.logout();
    res.redirect('/login');
});

router.get('/admin', requireAuth, function(req, res){
    res.render('admin', { title: 'Pirate Party Admin' });
});

module.exports = router;
