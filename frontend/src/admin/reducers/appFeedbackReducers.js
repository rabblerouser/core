import {
  CLEAR_MESSAGES,
  REPORT_FAILURE,
  REPORT_SUCCESS,
} from '../actions';

const initialState = {
  successMessages: [],
  failureMessages: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_MESSAGES: return {
      ...state,
      successMessages: [],
      failureMessages: [],
    };
    case REPORT_FAILURE: return {
      ...state,
      failureMessages: state.failureMessages.concat(action.message),
    };
    case REPORT_SUCCESS: return {
      ...state,
      successMessages: state.successMessages.concat(action.message),
    };
    default : return state;
  }
};
