const redux = require('redux');
const members = require('./membersReducer').reducer;
const groups = require('./groupsReducer').reducer;

const rootReducer = redux.combineReducers({
  members,
  groups,
});

module.exports = {
  reducer: rootReducer,
  getMembers: state => state.members,
  getGroups: state => state.groups,
};
