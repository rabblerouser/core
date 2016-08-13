import { fork } from 'redux-saga/effects';

import { watchBranchListRequest, watchBranchRemoveRequest } from './branchSagas';

export default function* rootSaga() {
  yield [
    fork(watchBranchListRequest),
    fork(watchBranchRemoveRequest),
  ];
}
