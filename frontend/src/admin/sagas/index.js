import { fork } from 'redux-saga/effects';

import { watchBranchListRequest, watchAppStarted } from './branchSagas';
import { sagas as branchViewSagas } from '../branchView/';

export default function* rootSaga() {
  yield [
    fork(watchBranchListRequest),
    fork(watchAppStarted),
    fork(branchViewSagas),
  ];
}
