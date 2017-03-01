const redux = require('redux');
const members = require('./membersReducer').reducer;

const rootReducer = redux.combineReducers({
  members,
});

module.exports = {
  reducer: rootReducer,
  getMembers: state => state.members,
};
