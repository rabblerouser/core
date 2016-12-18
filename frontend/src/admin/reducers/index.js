import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import { reducers as branchView } from '../branchView/';
import { reducers as groups } from '../groupView/';
import { reducers as members } from '../memberView/';

export default combineReducers({
  branchView,
  branches: branchReducers,
  groups,
  members,
  appFeedback: appFeedbackReducers,
  form: formReducer,
});
