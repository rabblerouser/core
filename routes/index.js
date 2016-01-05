var express = require('express');
var router = express.Router();
var membersController = require('../controllers/membersController');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/members/new', function(req, res, next) {
  res.render('members/new', { title: 'New Member' });
});

router.get('/members/eligibility', function(req, res, next) {
    res.render('members/eligibility', {title: 'Eligibility'});
});

router.get('/members/payment', function(req, res, next) {
    res.render('members/payment', {title: 'Pay What You Want'});
});

router.post("/members", membersController.newMemberHandler);

module.exports = router;
