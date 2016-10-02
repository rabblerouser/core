import { put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import {
  BRANCH_LIST_REQUESTED,
  BRANCH_REMOVE_REQUESTED,
  BRANCH_CREATE_REQUESTED,
  BRANCH_UPDATE_REQUESTED,
  branchListUpdated,
  branchRemoved,
  branchCreated,
  branchUpdated,
  finishEditBranch,
} from '../actions/branchActions';
import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/appFeedbackActions';
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

export function* createBranch({ payload }) {
  const { branch, success, failure } = payload;
  try {
    yield put(clearMessages());
    const savedBranch = yield call(branchService.createBranch, branch);
    yield put(branchCreated(savedBranch));
    yield call(success);
    yield put(reportSuccess('Branch successfully added'));
  } catch (error) {
    yield call(failure);
    yield put(reportFailure(GENERAL_ERROR_MSG));
  } finally {
    yield put(finishEditBranch());
  }
}

export function* updateBranch({ payload }) {
  const { branch, success, failure } = payload;
  try {
    yield put(clearMessages());
    yield call(branchService.updateBranch, branch);
    yield put(branchUpdated(branch));
    yield call(success);
    yield put(reportSuccess('Branch successfully updated'));
  } catch (error) {
    yield call(failure);
    yield put(reportFailure(GENERAL_ERROR_MSG));
  } finally {
    yield put(finishEditBranch());
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
export function* watchBranchCreateRequest() {
  yield* takeLatest(BRANCH_CREATE_REQUESTED, createBranch);
}
export function* watchBranchUpdateRequest() {
  yield* takeLatest(BRANCH_UPDATE_REQUESTED, updateBranch);
}
export function* watchBranchRemoveRequest() {
  yield* takeLatest(BRANCH_REMOVE_REQUESTED, deleteBranch);
}
