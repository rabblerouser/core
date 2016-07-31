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
  selectedBranch: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BRANCH_LIST_UPDATED: return {
      ...state,
      availableBranches: action.branches,
      selectedBranch: action.branches[0],
    };
    case BRANCH_SELECTED: return {
      ...state,
      selectedBranch: state.availableBranches.find(branch => branch.id === action.branchId),
    };
    case BRANCH_UPDATED: return {
      ...state,
      availableBranches: _.uniq([action.branch].concat(state.availableBranches), 'id'),
      selectedBranch: state.availableBranches.find(branch => branch.id === action.branch.id),
    };
    case BRANCH_REMOVED: return {
      ...state,
      availableBranches: _.without(state.availableBranches, action.branch),
      selectedBranch: _.without(state.availableBranches, action.branch)[0],
    };

    default : return state;
  }
};

export const getSelectedBranch = state => getBranches(state).selectedBranch;
export const getSelectedBranchId = state => getBranches(state).selectedBranch.id;
export const getAvailableBranches = state => getBranches(state).availableBranches;
export const getCanSelectBranch = state => getBranches(state).availableBranches.length > 0;
