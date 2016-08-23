import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import modalReducers from './modalReducers';

export default combineReducers({
  branches: branchReducers,
  appFeedback: appFeedbackReducers,
  modal: modalReducers,
  form: formReducer,
});

export const getBranches = state => state.branches;
export const getModal = state => state.modal;
