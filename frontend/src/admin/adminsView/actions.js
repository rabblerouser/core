import axios from 'axios';
import {
  reportFailure,
} from '../actions/appFeedbackActions';
import { getSelectedBranchId } from '../reducers/branchReducers';

export const ADMIN_LIST_UPDATED = 'ADMIN_LIST_UPDATED';

export const adminListUpdated = admins => ({
  type: ADMIN_LIST_UPDATED,
  payload: { admins },
});

export const ADMIN_LIST_REQUESTED = 'ADMIN_LIST_REQUESTED';
export const adminListRequested = () => {
  const thunk = (dispatch, getState) => {
    const branchId = getSelectedBranchId(getState());
    return (
      axios.get(`/branches/${branchId}/admins`)
      .then(resp => resp.data)
      .then(({ admins }) => dispatch(adminListUpdated(admins)))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = ADMIN_LIST_REQUESTED;
  return thunk;
};
