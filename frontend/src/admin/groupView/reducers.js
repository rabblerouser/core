import { combineReducers } from 'redux';

import { GROUPS_LIST_UPDATED, GROUP_SELECTED, GROUP_REMOVED, GROUP_UPDATED, GROUP_CREATED } from './actions';
import { getGroupsView } from '../reducers/rootSelectors';

export const groups = (state = [], action) => {
  switch (action.type) {
    case GROUPS_LIST_UPDATED: return [...action.payload.groups];
    case GROUP_REMOVED: return state.filter(({ id }) => id !== action.payload.groupId);
    case GROUP_UPDATED: return state.map(group =>
      (group.id === action.payload.group.id ? action.payload.group : group)
    );
    case GROUP_CREATED: return [...state, action.payload.group];
    default : return state;
  }
};

export const selected = (state = 'unassigned', action) => {
  switch (action.type) {
    case GROUP_SELECTED: return action.payload.groupId;
    case GROUP_REMOVED: return 'unassigned';
    default : return state;
  }
};

export default combineReducers({
  groups,
  selected,
});

export const getGroups = state => getGroupsView(state).groups;
export const getSelectedGroupId = state => getGroupsView(state).selected;
export const getSelectedGroup = state => {
  const groupList = getGroupsView(state).groups;
  const selectedId = getGroupsView(state).selected;
  return groupList.find(({ id }) => selectedId === id);
};
