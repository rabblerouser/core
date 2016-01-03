var express = require('express');
var router = express.Router();
var membersController = require('../controllers/membersController');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/members", membersController.newMemberHandler);

module.exports = router;
