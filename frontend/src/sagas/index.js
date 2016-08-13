import { fork } from 'redux-saga/effects';

import { watchBranchListRequest,
  watchBranchRemoveRequest,
  watchBranchCreateRequest,
  watchBranchUpdateRequest,
 } from './branchSagas';

export default function* rootSaga() {
  yield [
    fork(watchBranchListRequest),
    fork(watchBranchRemoveRequest),
    fork(watchBranchCreateRequest),
    fork(watchBranchUpdateRequest),
  ];
}
