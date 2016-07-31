import { combineReducers } from 'redux';

import branchReducers from './branchReducers';
import appFeedbackReducers from './appFeedbackReducers';

export default combineReducers({
  branches: branchReducers,
  appFeedback: appFeedbackReducers,
});

export const getBranches = state => state.branches;
