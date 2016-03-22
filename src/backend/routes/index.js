'use strict';

var express = require('express');
var router = express.Router();
var membersController = require('../controllers/membersController');
var branchesController = require('../controllers/branchesController');
var groupsController = require('../controllers/groupsController');
var adminController = require('../controllers/adminController');
var branchAuthorization = require('../security/pathAccessValidator');
let requireAuth = require('../security/authenticationRequired');
let login = require('../security/loginHandler');

router.get('/', function (req, res) {
    res.render('index', {title: 'The Lab - Sign Up'});
});

router.post('/register', membersController.register);
router.get('/branches', branchesController.list);

router.post('/login', login);
router.get('/login', function (req, res) {
    res.render('login', {error: ''});
});

router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.get('/admin/branches', [requireAuth], branchesController.branchesForAdmin);
router.get('/admin', [requireAuth], function (req, res) {
    res.render('admin', {title: 'The Lab Admin'});
});


router.put('/branches/:branchId/members/:id', [requireAuth, branchAuthorization], membersController.edit);
router.get('/branches/:branchId/members', [requireAuth, branchAuthorization], membersController.list);

router.get('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.forBranch);
router.post('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.create);
router.put('/branches/:branchId/admins/:id', [requireAuth, branchAuthorization], adminController.update);
router.delete('/branches/:branchId/admins/:adminId', [requireAuth, branchAuthorization], adminController.delete);

router.post('/branches/:branchId/groups/:groupId/members', [requireAuth, branchAuthorization], groupsController.addMembers);
router.get('/branches/:id/groups', [requireAuth, branchAuthorization], branchesController.groupsByBranch);
router.post('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.create);
router.delete('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.delete);
router.put('/branches/:branchId/groups/:groupId',  [requireAuth, branchAuthorization], groupsController.update);
module.exports = router;
