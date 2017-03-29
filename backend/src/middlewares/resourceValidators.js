const store = require('../store');

const checkBranchPresence = (req, res, next) => {
  if (store.getBranches().find(branch => branch.id === req.params.branchId)) {
    next();
  } else {
    res.sendStatus(404);
  }
};

const checkAdminPresence = (req, res, next) => {
  if (store.getAdmins().find(admin => admin.id === req.params.adminId)) {
    next();
  } else {
    res.sendStatus(404);
  }
};

const checkBranchAdminPresence = (req, res, next) => {
  if (store.getAdmins().find(admin => admin.id === req.params.adminId && admin.branchId === req.params.branchId)) {
    next();
  } else {
    res.sendStatus(404);
  }
};

const checkBranchMemberPresence = (req, res, next) => {
  if (store.getMembers().find(member => member.id === req.params.memberId && member.branchId === req.params.branchId)) {
    next();
  } else {
    res.sendStatus(404);
  }
};

const checkBranchGroupPresence = (req, res, next) => {
  if (store.getGroups().find(group => group.id === req.params.groupId && group.branchId === req.params.branchId)) {
    next();
  } else {
    res.sendStatus(404);
  }
};

module.exports = {
  checkBranchPresence,
  checkAdminPresence,
  checkBranchAdminPresence,
  checkBranchMemberPresence,
  checkBranchGroupPresence,
};
