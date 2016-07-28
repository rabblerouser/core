export const BRANCH_LIST_UPDATED = 'BRANCH_LIST_UPDATED';
export const BRANCH_SELECTED = 'BRANCH_SELECTED';
export const BRANCH_UPDATED = 'BRANCH_UPDATED';
export const BRANCH_REMOVED = 'BRANCH_REMOVED';

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

export const branchUpdated = branch => (
  {
    type: BRANCH_UPDATED,
    branch,
  }
);

export const branchRemoved = branch => (
  {
    type: BRANCH_REMOVED,
    branch,
  }
);
