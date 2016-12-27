import axios from 'axios';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../../actions/appFeedbackActions';

import {
  branchListRequested,
} from '../../actions';

export const EDIT_BRANCH = 'EDIT_BRANCH';
export const editBranch = branch => (
  {
    type: EDIT_BRANCH,
    branch,
  }
);

export const ADD_BRANCH = 'ADD_BRANCH';
export const addBranch = () => ({ type: ADD_BRANCH });

export const BRANCH_REMOVED = 'BRANCH_REMOVED';
export const branchRemoved = branch => (
  {
    type: BRANCH_REMOVED,
    branchId: branch.id,
  }
);

export const FINISH_EDIT_BRANCH = 'FINISH_EDIT_BRANCH';
export const finishEditBranch = () => ({ type: FINISH_EDIT_BRANCH });

export const BRANCH_REMOVE_REQUESTED = 'BRANCH_REMOVE_REQUESTED';
export const branchRemoveRequested = branch => {
  const thunk = dispatch => {
    dispatch(clearMessages());
    return (
      axios.delete(`/branches/${branch.id}`, branch)
      .then(() => {
        dispatch(branchListRequested());
        dispatch(branchRemoved(branch));
        dispatch(reportSuccess('Branch successfully removed'));
      })
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = BRANCH_REMOVE_REQUESTED;
  return thunk;
};

export const BRANCH_UPDATED = 'BRANCH_UPDATED';
export const branchUpdated = branch => (
  {
    type: BRANCH_UPDATED,
    branch,
  }
);

export const BRANCH_UPDATE_REQUESTED = 'BRANCH_UPDATE_REQUESTED';
export const branchUpdateRequested = branch => {
  const thunk = dispatch => {
    dispatch(clearMessages());
    return (
      axios.put(`/branches/${branch.id}`, branch)
      .then(() => dispatch(branchListRequested()))
      .then(() => dispatch(branchUpdated(branch)))
      .then(() => dispatch(reportSuccess('Branch successfully updated')))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = BRANCH_UPDATE_REQUESTED;
  return thunk;
};

export const BRANCH_CREATED = 'BRANCH_CREATED';
export const branchCreated = branch => (
  {
    type: BRANCH_CREATED,
    branch,
  }
);

export const BRANCH_CREATE_REQUESTED = 'BRANCH_CREATE_REQUESTED';
export const branchCreateRequested = branch => {
  const thunk = dispatch => {
    dispatch(clearMessages());
    let savedBranch;
    return (
      axios.post('/branches', branch)
      .then(resp => { savedBranch = resp.data; })
      .then(() => dispatch(branchListRequested()))
      .then(() => dispatch(branchCreated(savedBranch)))
      .then(() => dispatch(reportSuccess('Branch successfully created')))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = BRANCH_CREATE_REQUESTED;
  return thunk;
};
