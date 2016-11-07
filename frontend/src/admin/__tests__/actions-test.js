import axios from 'axios';

import { branchListRequested, appStarted } from '../actions';
import * as selectors from '../reducers/branchReducers';

describe('admin/actions', () => {
  let dispatch;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dispatch = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('branchListRequested', () => {
    let request;

    beforeEach(() => {
      request = sandbox.stub(axios, 'get').withArgs('/admin/branches');
    });

    it('should update the branch list when the request succeeds', done => {
      request.returns(Promise.resolve({ data: { branches: [{ id: 123 }] } })
      );
      branchListRequested()(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'BRANCH_LIST_UPDATED', branches: [{ id: 123 }] })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());

      branchListRequested()(dispatch)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE', message: undefined })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('appStarted', () => {
    let branchListRequest;
    const getState = () => {};

    beforeEach(() => {
      sandbox.stub(selectors, 'getFirstBranch').returns({ id: '123' });
      branchListRequest = dispatch.withArgs(sinon.match({ type: 'BRANCH_LIST_REQUESTED' }));
    });

    it('should request the branch list and select the first branch when the request succeeds', done => {
      branchListRequest.returns(Promise.resolve());

      appStarted()(dispatch, getState)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'BRANCH_LIST_REQUESTED' })).toEqual(true);
        expect(dispatch.calledWithMatch({ type: 'BRANCH_SELECTED', branchId: '123' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      branchListRequest.returns(Promise.reject());

      appStarted()(dispatch, getState)
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE', message: undefined })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });
});
