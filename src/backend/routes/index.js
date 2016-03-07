'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var membersController = require('../controllers/membersController');
var branchesController = require('../controllers/branchesController');
var groupsController = require('../controllers/groupsController');
var branchAuthorization = require('../authorization/pathAccessValidator');

function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        require('../lib/logger').info('Attempted unauth access', req.url);
        req.session.messages = 'You need to login to view this page';
        res.redirect('/login');
        return;
    }
    next();
}

router.get('/', function (req, res) {
    res.render('index', {title: 'The Lab - Sign Up'});
});

router.post('/members', membersController.createNewMember);
router.get('/branches', branchesController.list);

router.post('/login',
    passport.authenticate('local'), function (req, res) {
        req.session.save(function () {
            res.redirect('/admin');
        });
    });

router.get('/login', function (req, res) {
    res.render('login', {title: 'Login'});
});

router.get('/logout', requireAuth, function (req, res) {
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
