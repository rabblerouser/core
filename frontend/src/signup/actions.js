export const PAGE_ERROR = 'PAGE_ERROR';
export const CLEAR_PAGE_ERROR = 'CLEAR_PAGE_ERROR';

export const pageError = message => (
  {
    type: PAGE_ERROR,
    error: {
      message,
    },
  }
);
export const clearPageError = () => ({ type: CLEAR_PAGE_ERROR });

export const BRANCH_LIST_REQUESTED = 'BRANCH_LIST_REQUESTED';
export const BRANCH_LIST_UPDATED = 'BRANCH_LIST_UPDATED';

export const branchListRequested = () => ({ type: BRANCH_LIST_REQUESTED });
export const branchListUpdated = branches => (
  {
    type: BRANCH_LIST_UPDATED,
    payload: {
      branches,
    },
  }
);

export const REGISTER_START = 'REGISTER_START';
export const REGISTER_REQUESTED = 'REGISTER_REQUESTED';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export const registerStart = () => ({ type: REGISTER_START });
export const registerRequested = (member, onSuccess, onFailure) => (
  {
    type: REGISTER_REQUESTED,
    payload: {
      member,
      onSuccess,
      onFailure,
    },
  }
);
export const registerSuccess = () => (
  {
    type: REGISTER_SUCCESS,
  }
);
