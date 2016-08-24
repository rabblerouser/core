export const BRANCH_LIST_REQUESTED = 'BRANCH_LIST_REQUESTED';
export const BRANCH_LIST_UPDATED = 'BRANCH_LIST_UPDATED';
export const BRANCH_SELECTED = 'BRANCH_SELECTED';
export const BRANCH_CREATE_REQUESTED = 'BRANCH_CREATE_REQUESTED';
export const BRANCH_CREATED = 'BRANCH_CREATED';
export const BRANCH_UPDATE_REQUESTED = 'BRANCH_UPDATE_REQUESTED';
export const BRANCH_UPDATED = 'BRANCH_UPDATED';
export const BRANCH_REMOVE_REQUESTED = 'BRANCH_REMOVE_REQUESTED';
export const BRANCH_REMOVED = 'BRANCH_REMOVED';
export const EDIT_BRANCH = 'EDIT_BRANCH';
export const ADD_BRANCH = 'ADD_BRANCH';
export const FINISH_EDIT_BRANCH = 'FINISH_EDIT_BRANCH';

export const editBranch = () => ({ type: EDIT_BRANCH });
export const addBranch = () => ({ type: ADD_BRANCH });
export const finishEditBranch = () => ({ type: FINISH_EDIT_BRANCH });

export const branchListRequested = () => ({ type: BRANCH_LIST_REQUESTED });

export const branchListUpdated = branches => (
  {
    type: BRANCH_LIST_UPDATED,
    branches,
    selectedBranch: branches.length > 0 ? branches[0].id : '',
  }
);

export const branchSelected = branchId => (
  {
    type: BRANCH_SELECTED,
    branchId,
  }
);

export const branchCreateRequested = (branch, success, failure) => (
  {
    type: BRANCH_CREATE_REQUESTED,
    payload: {
      branch,
      success,
      failure,
    },
  }
);

export const branchCreated = branch => (
  {
    type: BRANCH_CREATED,
    branch,
  }
);

export const branchUpdateRequested = (branch, success, failure) => (
  {
    type: BRANCH_UPDATE_REQUESTED,
    payload: {
      branch,
      success,
      failure,
    },
  }
);

export const branchUpdated = branch => (
  {
    type: BRANCH_UPDATED,
    branch,
  }
);

export const branchRemoveRequested = branch => (
  {
    type: BRANCH_REMOVE_REQUESTED,
    branch,
  }
);

export const branchRemoved = branch => (
  {
    type: BRANCH_REMOVED,
    branchId: branch.id,
  }
);
