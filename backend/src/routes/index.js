'use strict';

const express = require('express');
const router = new express.Router();
const membersController = require('../controllers/membersController');
const branchesController = require('../controllers/branchesController');
const groupsController = require('../controllers/groupsController');
const adminController = require('../controllers/adminController');
const branchAuthorization = require('../security/branchAccessValidator');
const superAdminOnly = require('../security/superAdminOnlyValidator');
const requireAuth = require('../security/authenticationRequired');
const login = require('../security/loginHandler');

router.get('/', (req, res) =>
  res.render('signup')
);

router.get('/login', (req, res) =>
  res.render('login', { error: '' })
);

router.get('/dashboard*', [requireAuth], (req, res) =>
  res.render('admin'));

router.post('/register', membersController.register);
router.get('/branches', branchesController.list);
router.post('/login', login);

router.get('/logout', (req, res) =>
  req.session.destroy(() => res.redirect('/login'))
);

router.get('/admins', [requireAuth, superAdminOnly], adminController.list);
router.post('/admins', [requireAuth, superAdminOnly], adminController.createSuperAdmin);
router.put('/admins/:adminId', [requireAuth, superAdminOnly], adminController.updateSuperAdmin);
router.delete('/admins/:adminId', [requireAuth, superAdminOnly], adminController.deleteSuperAdmin);

router.get('/admin/branches', [requireAuth], branchesController.branchesForAdmin);
router.post('/branches', [requireAuth, superAdminOnly], branchesController.create);
router.put('/branches/:branchId', [requireAuth, superAdminOnly], branchesController.update);
router.delete('/branches/:branchId', [requireAuth, superAdminOnly], branchesController.delete);

router.put('/branches/:branchId/members/:id', [requireAuth, branchAuthorization], membersController.edit);
router.get('/branches/:branchId/members', [requireAuth, branchAuthorization], membersController.list);
router.get('/branches/:branchId/members.csv', [requireAuth, branchAuthorization], membersController.exportBranchMembers);
router.delete('/branches/:branchId/members/:memberId', [requireAuth, branchAuthorization], membersController.delete);

router.get('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.forBranch);
router.post('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.create);
router.put('/branches/:branchId/admins/:id', [requireAuth, branchAuthorization], adminController.update);
router.delete('/branches/:branchId/admins/:adminId', [requireAuth, branchAuthorization], adminController.delete);

router.post('/branches/:branchId/groups/:groupId/members',
  [requireAuth, branchAuthorization], groupsController.addMembers);
router.get('/branches/:id/groups', [requireAuth, branchAuthorization], branchesController.groupsByBranch);
router.post('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.create);
router.delete('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.delete);
router.put('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.update);
module.exports = router;
