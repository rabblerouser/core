import axios from 'axios';

import * as groupSelectors from '../reducers';
import * as branchSelectors from '../../reducers/branchReducers';

import {
  groupRemoveRequested,
 } from '../actions';

describe('admin/groupView/actions', () => {
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

  describe('groupRemoveRequested', () => {
    beforeEach(() => {
      spyOn(groupSelectors, 'getSelectedGroupId').and.returnValue('111');
      spyOn(branchSelectors, 'getSelectedBranchId').and.returnValue('123');

      request = sandbox.stub(axios, 'delete').withArgs('/branches/123/groups/111');
    });

    it('should dispatch a successful remove', done => {
      request.returns(Promise.resolve());
      groupRemoveRequested()(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'GROUP_REMOVED', payload: { groupId: '111' } })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      groupRemoveRequested({ id: 123 })(dispatch, () => {})
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
