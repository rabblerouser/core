import { combineReducers } from 'redux';

import {
  MEMBER_LIST_UPDATED,
  MEMBER_UPDATED,
  MEMBER_REMOVED,
  EDIT_MEMBER,
  FINISH_EDIT_MEMBER,
} from './actions';
import { getMembersView } from '../reducers/rootSelectors';

export const members = (state = [], action) => {
  switch (action.type) {
    case MEMBER_LIST_UPDATED: return [...action.payload.members];
    case MEMBER_REMOVED: return state.filter(({ id }) => id !== action.payload.memberId);
    case MEMBER_UPDATED: return state.map(member =>
      (member.id === action.payload.member.id ? action.payload.member : member)
    );
    default : return state;
  }
};

export const selected = (state = '', action) => {
  switch (action.type) {
    case EDIT_MEMBER: return action.payload.memberId;
    case FINISH_EDIT_MEMBER: return '';
    default : return state;
  }
};

export const isEditing = (state = false, action) => {
  switch (action.type) {
    case EDIT_MEMBER: return true;
    case FINISH_EDIT_MEMBER: return false;
    default : return state;
  }
};

export default combineReducers({
  members,
  selected,
  isEditing,
});

export const getIsEditActive = state => getMembersView(state).isEditing;

export const getMembers = state => getMembersView(state).members;
export const getSelectedMember = state => {
  const memberList = getMembersView(state).members;
  const selectedId = getMembersView(state).selected;
  return memberList.find(({ id }) => selectedId === id);
};
