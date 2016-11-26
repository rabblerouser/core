import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import { reducers as branchView } from '../branchView/';
import { reducers as groups } from '../groupView/';

export default combineReducers({
  branchView,
  branches: branchReducers,
  groups,
  appFeedback: appFeedbackReducers,
  form: formReducer,
});
