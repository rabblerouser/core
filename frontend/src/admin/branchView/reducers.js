import {
  EDIT_BRANCH,
  ADD_BRANCH,
  FINISH_EDIT_BRANCH,
} from './actions';

import { getBranchView } from '../reducers/rootSelectors';
import { getSelectedBranch as selected } from '../reducers/branchReducers';
export const getSelectedBranch = selected;

export const isEditing = (state = false, action) => {
  switch (action.type) {
    case EDIT_BRANCH: return true;
    case ADD_BRANCH: return true;
    case FINISH_EDIT_BRANCH: return false;
    default : return state;
  }
};

export const editedBranch = (state = {}, action) => {
  switch (action.type) {
    case EDIT_BRANCH: return action.branch;
    case FINISH_EDIT_BRANCH: return {};
    default : return state;
  }
};

export const getIsEditActive = state => getBranchView(state).isEditing;
export const getEditedBranch = state => getBranchView(state).editedBranch;
