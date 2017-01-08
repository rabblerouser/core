import { combineReducers } from 'redux';
import { getUser } from './rootSelectors';

import { USER_DETAILS_RECEIVED } from '../actions';

export const type = (state = '', action) => {
  switch (action.type) {
    case USER_DETAILS_RECEIVED: return action.payload.type;
    default : return state;
  }
};

export default combineReducers({
  type,
});

export const getUserType = state => getUser(state).type;
