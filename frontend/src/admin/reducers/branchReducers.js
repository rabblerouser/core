import { getBranches } from './rootSelectors';

import {
  BRANCH_LIST_UPDATED,
  BRANCH_SELECTED,
} from '../actions';

import {
  BRANCH_CREATED,
  BRANCH_REMOVED,
} from '../branchManagement/branchView/actions';

const initialState = {
  branches: [],
  selectedBranch: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BRANCH_LIST_UPDATED: return {
      ...state,
      branches: action.branches,
    };
    case BRANCH_SELECTED: return {
      ...state,
      selectedBranch: action.branchId ? action.branchId : state.branches[0].id,
    };
    case BRANCH_CREATED: return {
      ...state,
      selectedBranch: action.branch.id,
    };
    case BRANCH_REMOVED: {
      const filteredBranches = state.branches.filter(({ id }) => id !== action.branchId);
      return {
        ...state,
        selectedBranch: filteredBranches.length > 0 ? filteredBranches[0].id : '',
      };
    }
    default : return state;
  }
};

export const getSelectedBranch = state => {
  const branches = getBranches(state).branches;
  const branch = branches && branches.find(({ id }) => id === getBranches(state).selectedBranch);
  return branch || {};
};
export const getSelectedBranchId = state => getBranches(state).selectedBranch;
export const getAvailableBranches = state => getBranches(state).branches;
export const getCanSelectBranch = state => getBranches(state).branches.length > 1;
export const getFirstBranch = state => getBranches(state).branches.length > 0 && getBranches(state).branches[0];
