import { combineReducers } from 'redux';

import {
  NETWORK_ADMIN_LIST_UPDATED,
  NETWORK_ADMIN_REMOVED,
  NETWORK_ADMIN_CREATED,
  NETWORK_ADMIN_UPDATED,
  CREATE_NETWORK_ADMIN,
  EDIT_NETWORK_ADMIN,
  FINISH_EDIT_NETWORK_ADMIN,
} from './actions';
import { getNetworkAdminsView } from '../selectors';

export const networkAdmins = (state = [], action) => {
  switch (action.type) {
    case NETWORK_ADMIN_LIST_UPDATED: return [...action.payload.networkAdmins];
    case NETWORK_ADMIN_REMOVED: return state.filter(({ id }) => id !== action.payload.networkAdminId);
    case NETWORK_ADMIN_UPDATED: return state.map(networkAdmin =>
      (networkAdmin.id === action.payload.networkAdmin.id ? action.payload.networkAdmin : networkAdmin),
    );
    case NETWORK_ADMIN_CREATED: return [...state, action.payload.networkAdmin];
    default : return state;
  }
};

export const selected = (state = '', action) => {
  switch (action.type) {
    case EDIT_NETWORK_ADMIN: return action.payload.networkAdminId;
    case FINISH_EDIT_NETWORK_ADMIN: return '';
    default : return state;
  }
};

export const isEditing = (state = false, action) => {
  switch (action.type) {
    case CREATE_NETWORK_ADMIN: return true;
    case EDIT_NETWORK_ADMIN: return true;
    case FINISH_EDIT_NETWORK_ADMIN: return false;
    default : return state;
  }
};

export const isCreating = (state = false, action) => {
  switch (action.type) {
    case CREATE_NETWORK_ADMIN: return true;
    case FINISH_EDIT_NETWORK_ADMIN: return false;
    default : return state;
  }
};

export default combineReducers({
  networkAdmins,
  isEditing,
  selected,
  isCreating,
});

export const getIsEditActive = state => getNetworkAdminsView(state).isEditing;
export const getIsCreating = state => getNetworkAdminsView(state).isCreating;

export const getNetworkAdmins = state => getNetworkAdminsView(state).networkAdmins;
export const getSelectedNetworkAdmin = state => {
  const networkAdminList = getNetworkAdminsView(state).networkAdmins;
  const selectedId = getNetworkAdminsView(state).selected;
  return networkAdminList.find(({ id }) => selectedId === id);
};
export const getSelectedNetworkAdminEmail = state =>
  getSelectedNetworkAdmin(state) && getSelectedNetworkAdmin(state).email;
