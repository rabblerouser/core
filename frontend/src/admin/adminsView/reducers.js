import { combineReducers } from 'redux';

import {
  ADMIN_LIST_UPDATED,
  ADMIN_REMOVED,
} from './actions';
import { getAdminsView } from '../reducers/rootSelectors';

export const admins = (state = [], action) => {
  switch (action.type) {
    case ADMIN_LIST_UPDATED: return [...action.payload.admins];
    case ADMIN_REMOVED: return state.filter(({ id }) => id !== action.payload.adminId);
    default : return state;
  }
};

export default combineReducers({
  admins,
});

export const getAdmins = state => getAdminsView(state).admins;
