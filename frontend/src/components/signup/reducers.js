import {
  BRANCH_LIST_UPDATED,
  REGISTER_START,
  REGISTER_SUCCESS,
  PAGE_ERROR,
  CLEAR_PAGE_ERROR,
} from './actions';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

export const branches = (state = [], { type, payload }) => {
  switch (type) {
    case BRANCH_LIST_UPDATED: return payload.branches;
    default: return state;
  }
};

export const progress = (state = 0, { type }) => {
  switch (type) {
    case REGISTER_START: return 1;
    case REGISTER_SUCCESS: return 2;
    default: return state;
  }
};

export const pageError = (state = '', { type, error }) => {
  switch (type) {
    case PAGE_ERROR: return error.message;
    case CLEAR_PAGE_ERROR: return '';
    default: return state;
  }
};

export default combineReducers({
  branches,
  progress,
  pageError,
  form: formReducer,
});

export const getBranches = state => state.branches;
export const getProgress = state => state.progress;
export const getPageError = state => state.pageError;
