import _ from 'underscore';
import { getBranches } from './index';

import {
  BRANCH_LIST_UPDATED,
  BRANCH_SELECTED,
  BRANCH_UPDATED,
  BRANCH_REMOVED,
} from '../actions';

const initialState = {
  availableBranches: [],
  selectedBranch: '',
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
    case BRANCH_UPDATED: return {
      ...state,
      availableBranches: _.uniq([action.branch].concat(state.availableBranches), 'id'),
      selectedBranch: action.branch.id,
    };
    case BRANCH_REMOVED: return {
      ...state,
      availableBranches: state.availableBranches.filter(({ id }) => id !== action.branchId),
      selectedBranch: state.availableBranches.filter(({ id }) => id !== action.branchId)[0].id,
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
export const getCanSelectBranch = state => getBranches(state).availableBranches.length > 0;
