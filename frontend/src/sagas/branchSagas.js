import { put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { BRANCH_LIST_REQUESTED, BRANCH_REMOVE_REQUESTED,
  branchListUpdated, branchRemoved,
} from '../actions/branchActions';
import { clearMessages, reportFailure, reportSuccess } from '../actions/appFeedbackActions';

import branchService from '../services/branchService.js';

const GENERAL_ERROR_MSG = 'There was an error when contacting the server';

export function* fetchBranchList() {
  try {
    yield put(clearMessages());
    const branchList = yield call(branchService.getMyBranches);
    yield put(branchListUpdated(branchList));
  } catch (error) {
    yield put(reportFailure(GENERAL_ERROR_MSG));
  }
}

export function* deleteBranch(action) {
  try {
    yield put(clearMessages());
    yield call(branchService.deleteBranch, action.branch);
    yield put(branchRemoved(action.branch));
    yield put(reportSuccess('Branch successfully removed'));
  } catch (error) {
    yield put(reportFailure(GENERAL_ERROR_MSG));
  }
}

export function* watchBranchListRequest() {
  yield* takeLatest(BRANCH_LIST_REQUESTED, fetchBranchList);
}
export function* watchBranchRemoveRequest() {
  yield* takeLatest(BRANCH_REMOVE_REQUESTED, deleteBranch);
}
