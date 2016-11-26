import axios from 'axios';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/appFeedbackActions';
import { getSelectedGroupId } from './reducers';
import { getSelectedBranchId } from '../reducers/branchReducers';

export const GROUPS_LIST_UPDATED = 'GROUPS_LIST_UPDATED';

export const groupsListUpdated = groups => ({
  type: GROUPS_LIST_UPDATED,
  payload: { groups },
});

export const GROUP_SELECTED = 'GROUP_SELECTED';

export const groupSelected = groupId => ({
  type: GROUP_SELECTED,
  payload: { groupId },
});

export const GROUP_REMOVED = 'GROUP_REMOVED';
export const groupRemoved = groupId => ({
  type: GROUP_REMOVED,
  payload: { groupId },
});

export const GROUP_UPDATED = 'GROUP_UPDATED';
export const groupUpdated = group => ({
  type: GROUP_UPDATED,
  payload: { group },
});

export const GROUP_CREATED = 'GROUP_CREATED';
export const groupCreated = group => ({
  type: GROUP_CREATED,
  payload: { group },
});

export const EDIT_GROUP = 'EDIT_GROUP';
export const editGroup = () => ({
  type: EDIT_GROUP,
});

export const CREATE_GROUP = 'CREATE_GROUP';
export const createGroup = () => ({
  type: CREATE_GROUP,
});

export const FINISH_EDIT_GROUP = 'FINISH_EDIT_GROUP';
export const finishEditGroup = () => ({
  type: FINISH_EDIT_GROUP,
});

export const GROUP_REMOVE_REQUESTED = 'GROUP_REMOVE_REQUESTED';
export const groupRemoveRequested = () => {
  const thunk = (dispatch, getState) => {
    dispatch(clearMessages());
    const groupId = getSelectedGroupId(getState());
    const branchId = getSelectedBranchId(getState());
    return (
      axios.delete(`/branches/${branchId}/groups/${groupId}`)
      .then(() => {
        dispatch(groupRemoved(groupId));
        dispatch(reportSuccess('Group successfully removed'));
      })
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = GROUP_REMOVE_REQUESTED;
  return thunk;
};
