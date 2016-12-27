import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';
import { reducers as branchView } from '../branchView/';
import { reducers as groups } from '../groupView/';
import { reducers as members } from '../memberView/';
import { reducers as admins } from '../adminsView/';
import { reducers as networkManagement } from '../networkManagement/';

export default combineReducers({
  branchView,
  branches: branchReducers,
  groups,
  members,
  admins,
  networkManagement,
  appFeedback: appFeedbackReducers,
  form: formReducer,
});
