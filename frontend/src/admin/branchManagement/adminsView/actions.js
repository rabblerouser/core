import axios from 'axios';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../../actions/appFeedbackActions';
import { getSelectedBranchId } from '../../reducers/branchReducers';

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

export const ADMIN_CREATED = 'ADMIN_CREATED';
export const adminCreated = admin => ({
  type: ADMIN_CREATED,
  payload: { admin },
});

export const ADMIN_CREATE_REQUESTED = 'ADMIN_CREATE_REQUESTED';
export const adminCreateRequested = admin => {
  const thunk = (dispatch, getState) => {
    dispatch(clearMessages());
    const branchId = getSelectedBranchId(getState());
    return (
      axios.post(`/branches/${branchId}/admins`, admin)
      .then(resp => resp.data)
      .then(savedAdmin => dispatch(adminCreated(savedAdmin)))
      .then(() => dispatch(reportSuccess('Admin successfully created')))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = ADMIN_CREATE_REQUESTED;
  return thunk;
};

export const ADMIN_UPDATED = 'ADMIN_UPDATED';
export const adminUpdated = admin => ({
  type: ADMIN_UPDATED,
  payload: { admin },
});

export const ADMIN_UPDATE_REQUESTED = 'ADMIN_UPDATE_REQUESTED';
export const adminUpdateRequested = admin => {
  const thunk = (dispatch, getState) => {
    dispatch(clearMessages());
    const branchId = getSelectedBranchId(getState());
    return (
      axios.put(`/branches/${branchId}/admins/${admin.id}`, admin)
      .then(() => dispatch(adminUpdated(admin)))
      .then(() => dispatch(reportSuccess('Admin successfully updated')))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = ADMIN_UPDATE_REQUESTED;
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
        dispatch(reportSuccess('Admin successfully removed'));
      })
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = ADMIN_REMOVE_REQUESTED;
  return thunk;
};

export const EDIT_ADMIN = 'EDIT_ADMIN';
export const editAdmin = adminId => ({
  type: EDIT_ADMIN,
  payload: { adminId },
});

export const CREATE_ADMIN = 'CREATE_ADMIN';
export const createAdmin = () => ({
  type: CREATE_ADMIN,
});

export const FINISH_EDIT_ADMIN = 'FINISH_EDIT_ADMIN';
export const finishEditAdmin = () => ({
  type: FINISH_EDIT_ADMIN,
});
