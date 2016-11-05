import { fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { isEditing, editedBranch } from './reducers';
import {
  watchBranchCreateRequest,
  watchBranchUpdateRequest,
  watchBranchRemoveRequest,
} from './sagas';

export const reducers = combineReducers({
  isEditing,
  editedBranch,
});

export function* sagas() {
  yield [
    fork(watchBranchRemoveRequest),
    fork(watchBranchCreateRequest),
    fork(watchBranchUpdateRequest),
  ];
}

import view from './BranchDetails';
export default view;
