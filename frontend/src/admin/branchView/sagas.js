import axios from 'axios';
import { put, call } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import {
  BRANCH_REMOVE_REQUESTED,
  BRANCH_CREATE_REQUESTED,
  BRANCH_UPDATE_REQUESTED,
  branchRemoved,
  branchCreated,
  branchUpdated,
  finishEditBranch,
} from './actions';
import {
  branchListRequested,
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions';

const GENERAL_ERROR_MSG = 'There was an error when contacting the server';

export function* createBranch({ payload }) {
  const { branch, success, failure } = payload;
  try {
    yield put(clearMessages());
    const { data } = yield call(axios.post, '/branches/', branch);
    yield put(branchListRequested());
    yield put(branchCreated(data));
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
    yield call(axios.put, `/branches/${branch.id}/`, branch);
    yield put(branchListRequested());
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

export function* deleteBranch({ branch }) {
  try {
    yield put(clearMessages());
    yield call(axios.delete, `/branches/${branch.id}/`, branch);
    yield put(branchListRequested());
    yield put(branchRemoved(branch));
    yield put(reportSuccess('Branch successfully removed'));
  } catch (error) {
    yield put(reportFailure(GENERAL_ERROR_MSG));
  }
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
