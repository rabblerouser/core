import { combineReducers } from 'redux';

import { USER_DETAILS_RECEIVED } from '../actions';

export const type = (state = '', action) => {
  console.log(action.payload);
  switch (action.type) {
    case USER_DETAILS_RECEIVED: return action.payload.type;
    default : return state;
  }
};

export default combineReducers({
  type,
});
