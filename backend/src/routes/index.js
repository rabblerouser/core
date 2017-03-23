'use strict';

const express = require('express');
const membersController = require('../controllers/membersController');
const branchesController = require('../controllers/branchesController');
const groupsController = require('../controllers/groupsController');
const adminController = require('../controllers/adminController');
const branchAuthorization = require('../security/branchAccessValidator');
const superAdminOnly = require('../security/superAdminOnlyValidator');
const requireAuth = require('../security/authenticationRequired');
const login = require('../security/loginHandler');
const streamClient = require('../streamClient');

const memberActions = require('../actions/memberActions');
const groupActions = require('../actions/groupActions');
const branchActions = require('../actions/branchActions');

const router = new express.Router();

router.get('/', (req, res) =>
  res.render('signup')
);

streamClient.on('member-registered', memberActions.createMember);
streamClient.on('member-removed', memberActions.deleteMember);
streamClient.on('member-edited', memberActions.updateMember);

streamClient.on('group-created', groupActions.createGroup);
streamClient.on('group-removed', groupActions.deleteGroup);
streamClient.on('group-edited', groupActions.updateGroup);

streamClient.on('branch-created', branchActions.createBranch);
streamClient.on('branch-removed', branchActions.deleteBranch);
streamClient.on('branch-edited', branchActions.updateBranch);

router.post('/events', streamClient.listen());

router.get('/login', (req, res) =>
  res.render('login', { error: '' })
);

router.get('/dashboard*', [requireAuth], (req, res) => {
  res.cookie('user', JSON.stringify({ type: req.user.type }));
  return res.render('admin');
});

router.post('/login', login);
router.get('/logout', (req, res) =>
  req.session.destroy(() => res.redirect('/login'))
);

router.get('/admins', [requireAuth, superAdminOnly], adminController.getAllAdmins);
router.post('/admins', [requireAuth, superAdminOnly], adminController.createSuperAdmin);
router.put('/admins/:adminId', [requireAuth, superAdminOnly], adminController.updateSuperAdmin);
router.delete('/admins/:adminId', [requireAuth, superAdminOnly], adminController.deleteSuperAdmin);

router.get('/branches', branchesController.listBranches);
router.get('/admin/branches', [requireAuth], branchesController.branchesForAdmin);
router.post('/branches', [requireAuth, superAdminOnly], branchesController.createBranch);
router.put('/branches/:branchId', [requireAuth, superAdminOnly], branchesController.updateBranch);
router.delete('/branches/:branchId', [requireAuth, superAdminOnly], branchesController.deleteBranch);

router.post('/register', membersController.registerMember);
router.put('/branches/:branchId/members/:id', [requireAuth, branchAuthorization], membersController.editMember);
router.get('/branches/:branchId/members', [requireAuth, branchAuthorization], membersController.listBranchMembers);
router.get('/branches/:branchId/members.csv', [requireAuth, branchAuthorization], membersController.exportBranchMembers);
router.delete('/branches/:branchId/members/:memberId', [requireAuth, branchAuthorization], membersController.deleteMember);

router.get('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.getBranchAdmins);
router.post('/branches/:branchId/admins', [requireAuth, branchAuthorization], adminController.createBranchAdmin);
router.put('/branches/:branchId/admins/:id', [requireAuth, branchAuthorization], adminController.updateBranchAdmin);
router.delete('/branches/:branchId/admins/:adminId', [requireAuth, branchAuthorization], adminController.deleteBranchAdmin);

router.get('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.getBranchGroups);
router.post('/branches/:branchId/groups', [requireAuth, branchAuthorization], groupsController.createGroup);
router.delete('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.deleteGroup);
router.put('/branches/:branchId/groups/:groupId', [requireAuth, branchAuthorization], groupsController.updateGroup);
module.exports = router;
