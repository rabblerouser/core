import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import { reducers as branchView } from '../branchView/';

export default combineReducers({
  branchView,
  branches: branchReducers,
  appFeedback: appFeedbackReducers,
  form: formReducer,
});
