import axios from 'axios';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/appFeedbackActions';
import { getSelectedBranchId } from '../reducers/branchReducers';

export const MEMBER_LIST_UPDATED = 'MEMBER_LIST_UPDATED';

export const memberListUpdated = members => ({
  type: MEMBER_LIST_UPDATED,
  payload: { members },
});

export const MEMBER_LIST_REQUESTED = 'MEMBER_LIST_REQUESTED';
export const memberListRequested = () => {
  const thunk = (dispatch, getState) => {
    const branchId = getSelectedBranchId(getState());
    return (
      axios.get(`/branches/${branchId}/members`)
      .then(resp => resp.data)
      .then(({ members }) => dispatch(memberListUpdated(members)))
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = MEMBER_LIST_REQUESTED;
  return thunk;
};

export const MEMBER_UPDATED = 'MEMBER_UPDATED';
export const memberUpdated = member => ({
  type: MEMBER_UPDATED,
  payload: { member },
});

export const EDIT_MEMBER = 'EDIT_MEMBER';
export const editMember = memberId => ({
  type: EDIT_MEMBER,
  payload: { memberId },
});

export const MEMBER_REMOVED = 'MEMBER_REMOVED';
export const memberRemoved = memberId => ({
  type: MEMBER_REMOVED,
  payload: { memberId },
});

export const MEMBER_REMOVE_REQUESTED = 'MEMBER_REMOVE_REQUESTED';
export const memberRemoveRequested = memberId => {
  const thunk = (dispatch, getState) => {
    dispatch(clearMessages());
    const branchId = getSelectedBranchId(getState());
    return (
      axios.delete(`/branches/${branchId}/members/${memberId}`)
      .then(() => {
        dispatch(memberRemoved(memberId));
        dispatch(reportSuccess('Member successfully removed'));
      })
      .catch(() => dispatch(reportFailure()))
    );
  };
  thunk.type = MEMBER_REMOVE_REQUESTED;
  return thunk;
};


export const FINISH_EDIT_MEMBER = 'FINISH_EDIT_MEMBER';
export const finishEditMember = () => ({
  type: FINISH_EDIT_MEMBER,
});

export const MEMBER_UPDATE_REQUESTED = 'MEMBER_UPDATE_REQUESTED';
export const memberUpdateRequested = member => {
  const thunk = (dispatch, getState) => {
    dispatch(clearMessages());
    const branchId = getSelectedBranchId(getState());
    return axios.put(`/branches/${branchId}/members/${member.id}`, member)
      .then(() => dispatch(memberUpdated(member)))
      .then(() => dispatch(reportSuccess('Member successfully updated')))
      .catch(() => dispatch(reportFailure()));
  };
  thunk.type = MEMBER_UPDATE_REQUESTED;
  return thunk;
};
