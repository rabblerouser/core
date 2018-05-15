'use strict';

const express = require('express');
const passport = require('passport');
const membersController = require('../controllers/membersController');
const branchesController = require('../controllers/branchesController');
const groupsController = require('../controllers/groupsController');
const adminController = require('../controllers/adminController');
const branchAuthorization = require('../security/branchAccessValidator');
const superAdminOnly = require('../security/superAdminOnlyValidator');
const requireAuth = require('../security/authenticationRequired');
const adminType = require('../security/adminType');
const resourceValidators = require('../middlewares/resourceValidators');
const streamClient = require('../streamClient');
const store = require('../store');

const router = new express.Router();

router.get('/', (req, res) =>
  res.render('signup')
);

streamClient.on('member-registered', store.createMember);
streamClient.on('member-removed', store.deleteMember);
streamClient.on('member-edited', store.updateMember);

streamClient.on('group-created', store.createGroup);
streamClient.on('group-removed', store.deleteGroup);
streamClient.on('group-edited', store.updateGroup);

streamClient.on('branch-created', store.createBranch);
streamClient.on('branch-removed', store.deleteBranch);
streamClient.on('branch-edited', store.updateBranch);

streamClient.on('admin-created', store.createAdmin);
streamClient.on('admin-removed', store.deleteAdmin);
streamClient.on('admin-edited', store.updateAdmin);

router.post('/events', streamClient.listen());

router.get('/login', (req, res) =>
  res.render('login', { error: '' })
);

router.get('/dashboard*', [requireAuth], (req, res) => {
  res.cookie('user', JSON.stringify({ type: req.user.type, email: req.user.email }));
  return res.render('admin');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }));
router.get('/logout', (req, res) =>
  req.session.destroy(() => res.redirect('/login'))
);

// These matchers/middlewares greatly reduce the need for entity existence checks in controllers
router.all('*/branches/:branchId*', resourceValidators.checkBranchPresence);
router.all('*/admins/:adminId*', resourceValidators.checkAdminPresence);
router.all('*/branches/:branchId/admins/:adminId*', resourceValidators.checkBranchAdminPresence);
router.all('*/branches/:branchId/members/:memberId*', resourceValidators.checkBranchMemberPresence);
router.all('*/branches/:branchId/groups/:groupId*', resourceValidators.checkBranchGroupPresence);

router.get('/admins', [requireAuth, superAdminOnly], adminController.getSuperAdmins);
router.post('/admins', [requireAuth, superAdminOnly], adminController.createAdmin(adminType.super));
router.put('/admins/:adminId', [requireAuth, superAdminOnly], adminController.updateAdmin);
router.delete('/admins/:adminId', [requireAuth, superAdminOnly], adminController.deleteAdmin);

router.get('/branches', branchesController.listBranches);
router.get('/admin/branches', [requireAuth], branchesController.branchesForAdmin);
router.post('/branches', [requireAuth, superAdminOnly], branchesController.createBranch);
router.put('/branches/:branchId', [requireAuth, superAdminOnly], branchesController.updateBranch);
router.delete('/branches/:branchId', [requireAuth, superAdminOnly], branchesController.deleteBranch);

router.post('/register', membersController.registerMember);
router.put('/branches/:branchId/members/:memberId', [requireAuth, branchAuthorization], membersController.editMember);
router.get('/branches/:branchId/members', [requireAuth, branchAuthorization], membersController.listBranchMembers);
router.get('/branches/:branchId/members.csv', [requireAuth, branchAuthorization], membersController.exportBranchMembers);
router.delete('/branches/:branchId/members/:memberId', [requireAuth, branchAuthorization], membersController.deleteMember);

router.get('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.getBranchAdmins);
router.post('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.createAdmin(adminType.branch));
router.put('/branches/:branchId/admins/:adminId', [requireAuth, branchAuthorization], adminController.updateAdmin);
router.delete('/branches/:branchId/admins/:adminId', [requireAuth, branchAuthorization], adminController.deleteAdmin);

router.get('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.getBranchGroups);
router.post('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.createGroup);
router.delete('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.deleteGroup);
router.put('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.updateGroup);
module.exports = router;
