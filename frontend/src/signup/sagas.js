import { put, call, fork } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { getBranches, register } from './resources';

import {
  BRANCH_LIST_REQUESTED, branchListUpdated,
  registerStart,
  REGISTER_REQUESTED, registerSuccess,
  clearPageError, pageError,
} from './actions';

export function* fetchBranchList() {
  try {
    yield put(clearPageError());
    const { branches } = yield call(getBranches);
    yield put(branchListUpdated(branches));
    yield put(registerStart());
  } catch (error) {
    yield put(pageError('There was an error loading the page content'));
  }
}

export function* registerMember({ payload }) {
  const { member, onSuccess, onFailure } = payload;
  try {
    yield put(clearPageError());
    yield call(register, member);
    yield put(registerSuccess());
    yield call(onSuccess);
  } catch (error) {
    yield put(pageError('There was an error saving your changes'));
    yield call(onFailure);
  }
}

export function* watchBranchListRequest() {
  yield* takeLatest(BRANCH_LIST_REQUESTED, fetchBranchList);
}

export function* watchRegisterRequest() {
  yield* takeLatest(REGISTER_REQUESTED, registerMember);
}

export default function* rootSaga() {
  yield [
    fork(watchBranchListRequest),
    fork(watchRegisterRequest),
  ];
}
