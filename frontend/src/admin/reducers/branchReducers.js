import _ from 'underscore';
import { getBranches } from './index';

import {
  BRANCH_LIST_UPDATED,
  BRANCH_SELECTED,
  BRANCH_UPDATED,
  BRANCH_CREATED,
  BRANCH_REMOVED,
  EDIT_BRANCH,
  ADD_BRANCH,
  FINISH_EDIT_BRANCH,
} from '../actions';

const initialState = {
  availableBranches: [],
  selectedBranch: '',
  isEditing: false,
  editedBranch: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BRANCH_LIST_UPDATED: return {
      ...state,
      availableBranches: action.branches,
      selectedBranch: action.selectedBranch,
    };
    case BRANCH_SELECTED: return {
      ...state,
      selectedBranch: action.branchId,
    };
    case BRANCH_CREATED: return {
      ...state,
      availableBranches: state.availableBranches.concat(action.branch),
      selectedBranch: action.branch.id,
    };
    case BRANCH_UPDATED: return {
      ...state,
      availableBranches: _.uniq([action.branch].concat(state.availableBranches), 'id'),
      selectedBranch: action.branch.id,
    };
    case BRANCH_REMOVED: {
      const filteredBranches = state.availableBranches.filter(({ id }) => id !== action.branchId);
      return {
        ...state,
        availableBranches: filteredBranches,
        selectedBranch: filteredBranches.length > 0 ? filteredBranches[0].id : '',
      };
    }
    case EDIT_BRANCH: return {
      ...state,
      isEditing: true,
      editedBranch: state.selectedBranch,
    };
    case ADD_BRANCH: return {
      ...state,
      isEditing: true,
      editedBranch: '',
    };
    case FINISH_EDIT_BRANCH: return {
      ...state,
      isEditing: false,
      editedBranch: '',
    };
    default : return state;
  }
};

export const getSelectedBranch = state => {
  const branch = getBranches(state).availableBranches.find(({ id }) => id === getBranches(state).selectedBranch);
  return branch || {};
};
export const getSelectedBranchId = state => getBranches(state).selectedBranch;
export const getAvailableBranches = state => getBranches(state).availableBranches;
export const getCanSelectBranch = state => getBranches(state).availableBranches.length > 1;

export const getisEditActive = state => getBranches(state).isEditing;
export const getEditedBranch = state => {
  const branch = getBranches(state).availableBranches.find(({ id }) => id === getBranches(state).editedBranch);
  return branch || {};
};
