export const BRANCH_LIST_REQUESTED = 'BRANCH_LIST_REQUESTED';
export const BRANCH_LIST_UPDATED = 'BRANCH_LIST_UPDATED';
export const BRANCH_SELECTED = 'BRANCH_SELECTED';

export const APP_STARTED = 'APP_STARTED';
export const appStarted = () => ({ type: APP_STARTED });

export const branchListRequested = () => ({ type: BRANCH_LIST_REQUESTED });

export const branchListUpdated = branches => (
  {
    type: BRANCH_LIST_UPDATED,
    branches,
  }
);

export const branchSelected = branchId => (
  {
    type: BRANCH_SELECTED,
    branchId,
  }
);
