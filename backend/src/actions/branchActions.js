const store = require('../store');

const createBranch = branch => ({ type: 'CREATE_BRANCH', branch });
const deleteBranch = branch => ({ type: 'DELETE_BRANCH', branch });
const updateBranch = branch => ({ type: 'UPDATE_BRANCH', branch });

module.exports = store.bindActionCreators({
  createBranch,
  deleteBranch,
  updateBranch,
});
