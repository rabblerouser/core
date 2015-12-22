var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/join', function(req, res) {
  res.render('join', { title: 'Join' });
});

module.exports = router;
