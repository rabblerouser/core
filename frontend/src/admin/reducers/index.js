import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import { reducers as branchManagement } from '../branchManagement/';
import { reducers as networkManagement } from '../networkManagement/';

export default combineReducers({
  branches: branchReducers,
  branchManagement,
  networkManagement,
  appFeedback: appFeedbackReducers,
  form: formReducer,
});
