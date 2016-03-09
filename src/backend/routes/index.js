'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var membersController = require('../controllers/membersController');
var branchesController = require('../controllers/branchesController');
var groupsController = require('../controllers/groupsController');
var branchAuthorization = require('../security/pathAccessValidator');
let requireAuth = require('../security/authenticationRequired');
let login = require('../security/loginHandler');

router.get('/', function (req, res) {
    res.render('index', {title: 'The Lab - Sign Up'});
});

router.post('/members', membersController.createNewMember);
router.get('/branches', branchesController.list);

router.post('/login', login);
router.get('/login', function (req, res) {
    res.render('login', {error: ''});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/admin/branches', [requireAuth], branchesController.branchesForAdmin);
router.get('/admin', [requireAuth], function (req, res) {
    res.render('admin', {title: 'The Lab Admin'});
});

router.get('/branches/:branchId/members', [requireAuth, branchAuthorization], membersController.list);
router.post('/branches/:branchId/groups/:groupId/members', [requireAuth, branchAuthorization], groupsController.addMembers);
router.get('/branches/:id/groups', [requireAuth, branchAuthorization], branchesController.groupsByBranch);
router.post('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.create);

module.exports = router;
