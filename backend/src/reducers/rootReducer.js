const redux = require('redux');
const members = require('./membersReducer').reducer;
const groups = require('./groupsReducer').reducer;
const branches = require('./branchesReducer').reducer;

const rootReducer = redux.combineReducers({
  members,
  groups,
  branches,
});

module.exports = {
  reducer: rootReducer,
  getMembers: state => state.members,
  getGroups: state => state.groups,
  getBranches: state => state.branches,
};
