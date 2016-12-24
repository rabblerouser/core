import { combineReducers } from 'redux';

import { ADMIN_LIST_UPDATED,
} from './actions';
import { getAdminsView } from '../reducers/rootSelectors';

export const admins = (state = [], action) => {
  switch (action.type) {
    case ADMIN_LIST_UPDATED: return [...action.payload.admins];
    default : return state;
  }
};

export default combineReducers({
  admins,
});

export const getAdmins = state => getAdminsView(state).admins;
