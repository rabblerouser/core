import { getBranches } from './rootSelectors';

import {
  BRANCH_LIST_UPDATED,
  BRANCH_SELECTED,
} from '../actions';

import {
  BRANCH_CREATED,
  BRANCH_REMOVED,
} from '../branchView/actions';

const initialState = {
  availableBranches: [],
  selectedBranch: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BRANCH_LIST_UPDATED: return {
      ...state,
      availableBranches: action.branches,
    };
    case BRANCH_SELECTED: return {
      ...state,
      selectedBranch: action.branchId ? action.branchId : state.availableBranches[0].id,
    };
    case BRANCH_CREATED: return {
      ...state,
      selectedBranch: action.branch.id,
    };
    case BRANCH_REMOVED: {
      const filteredBranches = state.availableBranches.filter(({ id }) => id !== action.branchId);
      return {
        ...state,
        selectedBranch: filteredBranches.length > 0 ? filteredBranches[0].id : '',
      };
    }
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
