import { combineReducers } from 'redux';

import { GROUPS_LIST_UPDATED } from './actions';
import { getGroupsView } from '../reducers/rootSelectors';

export const groups = (state = [], action) => {
  switch (action.type) {
    case GROUPS_LIST_UPDATED: return [...action.payload.groups];
    default : return state;
  }
};

export default combineReducers({
  groups,
});

export const getGroups = state => getGroupsView(state).groups;
