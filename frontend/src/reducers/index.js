import { combineReducers } from 'redux';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import modalReducers from './modalReducers';

export default combineReducers({
  branches: branchReducers,
  appFeedback: appFeedbackReducers,
  modal: modalReducers,
});

export const getBranches = state => state.branches;
export const getModal = state => state.modal;
