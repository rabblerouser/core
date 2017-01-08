import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import userReducers from './userReducers';
import appFeedbackReducers from './appFeedbackReducers';
import { reducers as branchManagement } from '../branchManagement/';
import { reducers as networkManagement } from '../networkManagement/';

export default combineReducers({
  branches: branchReducers,
  user: userReducers,
  branchManagement,
  networkManagement,
  appFeedback: appFeedbackReducers,
  form: formReducer,
});
