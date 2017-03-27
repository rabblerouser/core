const store = require('../store');

const checkBranchPresence = (req, res, next) => {
  if (store.getBranches().find(branch => branch.id === req.params.branchId)) {
    next();
  } else {
    res.sendStatus(404);
  }
};

module.exports = {
  checkBranchPresence,
};
