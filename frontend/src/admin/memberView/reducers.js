import { combineReducers } from 'redux';

import { MEMBER_LIST_UPDATED } from './actions';
import { getMembersView } from '../reducers/rootSelectors';

export const members = (state = [], action) => {
  switch (action.type) {
    case MEMBER_LIST_UPDATED: return [...action.payload.members];
    default : return state;
  }
};

export default combineReducers({
  members,
});

export const getMembers = state => getMembersView(state).members;
