import axios from 'axios';
import { getFirstBranch } from './reducers/branchReducers';
import { reportFailure } from './actions/appFeedbackActions';

export const BRANCH_SELECTED = 'BRANCH_SELECTED';
export const branchSelected = branchId => (
  {
    type: BRANCH_SELECTED,
    branchId,
  }
);

export const BRANCH_LIST_UPDATED = 'BRANCH_LIST_UPDATED';
export const branchListUpdated = branches => (
  {
    type: BRANCH_LIST_UPDATED,
    branches,
  }
);

export const BRANCH_LIST_REQUESTED = 'BRANCH_LIST_REQUESTED';
export const branchListRequested = () => {
  const thunk = dispatch => (
    axios.get('/admin/branches')
    .then(req => req.data.branches)
    .then(branches => dispatch(branchListUpdated(branches)))
    .catch(() => dispatch(reportFailure()))
  );
  thunk.type = BRANCH_LIST_REQUESTED;
  return thunk;
};

export const APP_STARTED = 'APP_STARTED';
export const appStarted = () => {
  const thunk = (dispatch, getState) => (
    dispatch(branchListRequested())
    .then(() => {
      const branch = getFirstBranch(getState());
      dispatch(branchSelected(branch.id));
    })
    .catch(() => dispatch(reportFailure()))
  );
  thunk.type = APP_STARTED;
  return thunk;
};
