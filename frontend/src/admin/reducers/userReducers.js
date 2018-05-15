import { combineReducers } from 'redux';
import { getUser } from './rootSelectors';

import { USER_DETAILS_RECEIVED } from '../actions';

export const type = (state = '', action) => {
  switch (action.type) {
    case USER_DETAILS_RECEIVED: return action.payload.type;
    default : return state;
  }
};

export const email = (state = '', action) => {
  switch (action.type) {
    case USER_DETAILS_RECEIVED: return action.payload.email;
    default : return state;
  }
};

export default combineReducers({
  type,
  email,
});

export const getUserType = state => getUser(state).type;
export const getUserEmail = state => getUser(state).email;
