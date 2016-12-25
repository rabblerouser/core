import { combineReducers } from 'redux';

import {
  ADMIN_LIST_UPDATED,
  ADMIN_REMOVED,
  ADMIN_CREATED,
  ADMIN_UPDATED,
  EDIT_ADMIN,
  FINISH_EDIT_ADMIN,
} from './actions';
import { getAdminsView } from '../reducers/rootSelectors';

export const admins = (state = [], action) => {
  switch (action.type) {
    case ADMIN_LIST_UPDATED: return [...action.payload.admins];
    case ADMIN_REMOVED: return state.filter(({ id }) => id !== action.payload.adminId);
    case ADMIN_UPDATED: return state.map(admin =>
      (admin.id === action.payload.admin.id ? action.payload.admin : admin)
    );
    case ADMIN_CREATED: return [...state, action.payload.admin];
    default : return state;
  }
};

export const selected = (state = '', action) => {
  switch (action.type) {
    case EDIT_ADMIN: return action.payload.adminId;
    case FINISH_EDIT_ADMIN: return '';
    default : return state;
  }
};

export default combineReducers({
  admins,
  selected,
});

export const getAdmins = state => getAdminsView(state).admins;
export const getSelectedAdmin = state => {
  const adminList = getAdminsView(state).admins;
  const selectedId = getAdminsView(state).selected;
  return adminList.find(({ id }) => selectedId === id);
};
