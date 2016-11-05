import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import modalReducers from './modalReducers';

import { reducers as branchView } from '../branchView/';

export default combineReducers({
  branchView,
  branches: branchReducers,
  appFeedback: appFeedbackReducers,
  modal: modalReducers,
  form: formReducer,
});
