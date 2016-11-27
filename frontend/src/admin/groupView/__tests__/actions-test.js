import axios from 'axios';

import * as groupSelectors from '../reducers';
import * as branchSelectors from '../../reducers/branchReducers';

import {
  groupRemoveRequested,
  groupCreateRequested,
  groupUpdateRequested,
  groupListRequested,
 } from '../actions';

describe('admin/groupView/actions', () => {
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

  describe('groupListRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'get').withArgs('/branches/123/groups');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve({ data: { groups: [{ id: '111' }] } }));
      groupListRequested()(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'GROUP_LIST_UPDATED', payload: { groups: [{ id: '111' }] },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      groupListRequested()(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('groupRemoveRequested', () => {
    beforeEach(() => {
      spyOn(groupSelectors, 'getSelectedGroupId').and.returnValue('111');
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
      groupRemoveRequested()(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('groupUpdateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'put').withArgs('/branches/123/groups/789');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve());
      groupUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'GROUP_UPDATED', payload: { group: { id: '789', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      groupUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('groupCreateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'post').withArgs('/branches/123/groups');
    });

    it('should dispatch a successful create', done => {
      request.returns(Promise.resolve({ data: { id: '123', name: 'some name' } }));
      groupCreateRequested({ name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'GROUP_CREATED', payload: { group: { id: '123', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      groupCreateRequested({ name: 'some name' })(dispatch, () => {})
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
