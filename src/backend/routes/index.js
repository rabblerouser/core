'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var membersController = require('../controllers/membersController');
var branchesController = require('../controllers/branchesController');
var groupsController = require('../controllers/groupsController');

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

router.get('/members/verify/:hash', membersController.verify);
router.get('/members/renew/:hash', membersController.renew);
router.get('/members', requireAuth, membersController.list);

router.post('/members/update', membersController.updateMemberHandler);
router.get('/verified', function (req, res) {
    res.render('account-verified', {title: 'Pirate Party Membership'});
});

router.post('/renew', membersController.renewMemberHandler);

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

router.get('/admin', requireAuth, function (req, res) {
    res.render('admin', {title: 'The Lab Admin'});
});

router.get('/branches', branchesController.list);
router.get('/branches/:id/groups', branchesController.groupsByBranch);

router.get('/groups', groupsController.list);

router.post('/branches/:branchId/groups/:groupId/members', groupsController.addMembers);

module.exports = router;
