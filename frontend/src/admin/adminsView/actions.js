import axios from 'axios';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
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

export const ADMIN_REMOVED = 'ADMIN_REMOVED';
export const adminRemoved = adminId => ({
  type: ADMIN_REMOVED,
  payload: { adminId },
});

export const ADMIN_REMOVE_REQUESTED = 'ADMIN_REMOVE_REQUESTED';
export const adminRemoveRequested = adminId => {
  const thunk = (dispatch, getState) => {
    dispatch(clearMessages());
    const branchId = getSelectedBranchId(getState());
    return (
      axios.delete(`/branches/${branchId}/admins/${adminId}`)
      .then(() => {
        dispatch(adminRemoved(adminId));
        dispatch(reportSuccess('Member successfully removed'));
      })
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = ADMIN_REMOVE_REQUESTED;
  return thunk;
};
