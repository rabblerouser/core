var express = require('express');
var router = express.Router();
var membersController = require('../controllers/membersController');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/members/new', function(req, res, next) {
    res.render('members/new', { title: 'New Member' });
});

router.post("/members", membersController.newMemberHandler);

module.exports = router;
