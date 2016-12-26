import axios from 'axios';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../../actions/appFeedbackActions';

export const NETWORK_ADMIN_LIST_UPDATED = 'NETWORK_ADMIN_LIST_UPDATED';

export const networkAdminListUpdated = networkAdmins => ({
  type: NETWORK_ADMIN_LIST_UPDATED,
  payload: { networkAdmins },
});

export const NETWORK_ADMIN_LIST_REQUESTED = 'NETWORK_ADMIN_LIST_REQUESTED';
export const networkAdminListRequested = () => {
  const thunk = dispatch => (
      axios.get('/admins')
      .then(resp => resp.data)
      .then(({ admins }) => dispatch(networkAdminListUpdated(admins)))
      .catch(() => dispatch(reportFailure()))
    );
  thunk.type = NETWORK_ADMIN_LIST_REQUESTED;
  return thunk;
};

export const NETWORK_ADMIN_CREATED = 'NETWORK_ADMIN_CREATED';
export const networkAdminCreated = networkAdmin => ({
  type: NETWORK_ADMIN_CREATED,
  payload: { networkAdmin },
});

export const NETWORK_ADMIN_CREATE_REQUESTED = 'NETWORK_ADMIN_CREATE_REQUESTED';
export const networkAdminCreateRequested = networkAdmin => {
  const thunk = dispatch => {
    dispatch(clearMessages());
    return (
      axios.post('/admins', networkAdmin)
      .then(resp => resp.data)
      .then(savedAdmin => dispatch(networkAdminCreated(savedAdmin)))
      .then(() => dispatch(reportSuccess('Network Admin successfully created')))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = NETWORK_ADMIN_CREATE_REQUESTED;
  return thunk;
};

export const NETWORK_ADMIN_UPDATED = 'NETWORK_ADMIN_UPDATED';
export const networkAdminUpdated = networkAdmin => ({
  type: NETWORK_ADMIN_UPDATED,
  payload: { networkAdmin },
});

export const NETWORK_ADMIN_UPDATE_REQUESTED = 'NETWORK_ADMIN_UPDATE_REQUESTED';
export const networkAdminUpdateRequested = networkAdmin => {
  const thunk = dispatch => {
    dispatch(clearMessages());
    return (
      axios.put(`/admins/${networkAdmin.id}`, networkAdmin)
      .then(() => dispatch(networkAdminUpdated(networkAdmin)))
      .then(() => dispatch(reportSuccess('Network Admin successfully updated')))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = NETWORK_ADMIN_UPDATE_REQUESTED;
  return thunk;
};

export const NETWORK_ADMIN_REMOVED = 'NETWORK_ADMIN_REMOVED';
export const networkAdminRemoved = networkAdminId => ({
  type: NETWORK_ADMIN_REMOVED,
  payload: { networkAdminId },
});

export const NETWORK_ADMIN_REMOVE_REQUESTED = 'NETWORK_ADMIN_REMOVE_REQUESTED';
export const networkAdminRemoveRequested = networkAdminId => {
  const thunk = dispatch => {
    dispatch(clearMessages());
    return (
      axios.delete(`/admins/${networkAdminId}`)
      .then(() => {
        dispatch(networkAdminRemoved(networkAdminId));
        dispatch(reportSuccess('Network Admin successfully removed'));
      })
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = NETWORK_ADMIN_REMOVE_REQUESTED;
  return thunk;
};

export const EDIT_NETWORK_ADMIN = 'EDIT_NETWORK_ADMIN';
export const editNetworkAdmin = networkAdminId => ({
  type: EDIT_NETWORK_ADMIN,
  payload: { networkAdminId },
});

export const CREATE_NETWORK_ADMIN = 'CREATE_NETWORK_ADMIN';
export const createNetworkAdmin = () => ({
  type: CREATE_NETWORK_ADMIN,
});


export const FINISH_EDIT_NETWORK_ADMIN = 'FINISH_EDIT_NETWORK_ADMIN';
export const finishEditNetworkAdmin = () => ({
  type: FINISH_EDIT_NETWORK_ADMIN,
});
