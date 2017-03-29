const redux = require('redux');
const members = require('./reducers/membersReducer');
const groups = require('./reducers/groupsReducer');
const branches = require('./reducers/branchesReducer');

const rootReducer = redux.combineReducers({
  members,
  groups,
  branches,
});
const store = redux.createStore(rootReducer);

// stream-client needs us to return promises from our event handlers
const dispatch = action => {
  try {
    store.dispatch(action);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};
module.exports = {
  getBranches: () => store.getState().branches,
  createBranch: branch => dispatch({ type: 'CREATE_BRANCH', branch }),
  deleteBranch: branch => dispatch({ type: 'DELETE_BRANCH', branch }),
  updateBranch: branch => dispatch({ type: 'UPDATE_BRANCH', branch }),

  getGroups: () => store.getState().groups,
  createGroup: group => dispatch({ type: 'CREATE_GROUP', group }),
  deleteGroup: group => dispatch({ type: 'DELETE_GROUP', group }),
  updateGroup: group => dispatch({ type: 'UPDATE_GROUP', group }),

  getMembers: () => store.getState().members,
  createMember: member => dispatch({ type: 'CREATE_MEMBER', member }),
  deleteMember: member => dispatch({ type: 'DELETE_MEMBER', member }),
  updateMember: member => dispatch({ type: 'UPDATE_MEMBER', member }),
};
