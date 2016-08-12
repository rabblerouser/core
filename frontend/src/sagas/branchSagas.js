import { put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { BRANCH_LIST_REQUESTED, branchListUpdated } from '../actions/branchActions';
import { clearMessages, reportFailure } from '../actions/appFeedbackActions';

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

export function* watchBranchListRequest() {
  yield* takeLatest(BRANCH_LIST_REQUESTED, fetchBranchList);
}
