import axios from 'axios';

import * as branchSelectors from '../../reducers/branchReducers';

import {
  memberUpdateRequested,
  memberListRequested,
  memberRemoveRequested,
 } from '../actions';

describe('admin/memberView/actions', () => {
  let dispatch;
  let sandbox;
  let request;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dispatch = sandbox.spy();
    spyOn(branchSelectors, 'getSelectedBranchId').and.returnValue('123');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('memberRemoveRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'delete').withArgs('/branches/123/members/111');
    });

    it('should dispatch a successful remove', done => {
      request.returns(Promise.resolve());
      memberRemoveRequested('111')(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'MEMBER_REMOVED', payload: { memberId: '111' } })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      memberRemoveRequested(111)(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('memberListRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'get').withArgs('/branches/123/members');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve({ data: { members: [{ id: '111' }] } }));
      memberListRequested()(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'MEMBER_LIST_UPDATED', payload: { members: [{ id: '111' }] },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      memberListRequested()(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('memberUpdateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'put').withArgs('/branches/123/members/789');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve());
      memberUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'MEMBER_UPDATED', payload: { member: { id: '789', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      memberUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
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
