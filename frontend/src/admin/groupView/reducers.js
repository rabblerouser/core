import { combineReducers } from 'redux';

import { GROUPS_LIST_UPDATED, GROUP_SELECTED } from './actions';
import { getGroupsView } from '../reducers/rootSelectors';

export const groups = (state = [], action) => {
  switch (action.type) {
    case GROUPS_LIST_UPDATED: return [...action.payload.groups];
    default : return state;
  }
};

export const selected = (state = 'unassigned', action) => {
  switch (action.type) {
    case GROUP_SELECTED: return action.payload.groupId;
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
