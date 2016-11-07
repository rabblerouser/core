import axios from 'axios';

import {
  branchRemoveRequested,
  branchUpdateRequested,
  branchCreateRequested,
 } from '../actions';

describe('admin/branchView/actions', () => {
  let dispatch;
  let sandbox;
  let request;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dispatch = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('branchRemoveRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'delete').withArgs('/branches/123/');
    });

    it('should dispatch a successful remove and refresh the branch list', done => {
      request.returns(Promise.resolve());
      branchRemoveRequested({ id: 123 })(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'BRANCH_LIST_REQUESTED' })).toEqual(true);
        expect(dispatch.calledWithMatch({ type: 'BRANCH_REMOVED', branchId: 123 })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      branchRemoveRequested({ id: 123 })(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('branchUpdateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'put').withArgs('/branches/123/');
    });

    it('should dispatch a successful update and refresh the branch list', done => {
      request.returns(Promise.resolve());
      branchUpdateRequested({ id: 123 })(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'BRANCH_LIST_REQUESTED' })).toEqual(true);
        expect(dispatch.calledWithMatch({ type: 'BRANCH_UPDATED', branch: { id: 123 } })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      branchUpdateRequested({ id: 123 })(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('branchCreateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'post').withArgs('/branches/');
    });

    it('should dispatch a successful create and refresh the branch list', done => {
      request.returns(Promise.resolve({ data: { id: 123 } }));
      branchCreateRequested({ id: 123 })(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'BRANCH_LIST_REQUESTED' })).toEqual(true);
        expect(dispatch.calledWithMatch({ type: 'BRANCH_CREATED', branch: { id: 123 } })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      branchCreateRequested({ id: 123 })(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });
});
