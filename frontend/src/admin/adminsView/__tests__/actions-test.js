import axios from 'axios';

import * as branchSelectors from '../../reducers/branchReducers';
import {
  adminListRequested,
  adminRemoveRequested,
  adminCreateRequested,
  adminUpdateRequested,
 } from '../actions';

describe('admin/adminsView/actions', () => {
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

  describe('adminRemoveRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'delete').withArgs('/branches/123/admins/111');
    });

    it('should dispatch a successful remove', done => {
      request.returns(Promise.resolve());
      adminRemoveRequested('111')(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'ADMIN_REMOVED', payload: { adminId: '111' } })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      adminRemoveRequested(111)(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('adminListRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'get').withArgs('/branches/123/admins');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve({ data: { admins: [{ id: '111' }] } }));
      adminListRequested()(dispatch, () => {})
        .then(() => {
          expect(dispatch.calledWithMatch({
            type: 'ADMIN_LIST_UPDATED', payload: { admins: [{ id: '111' }] },
          })).toEqual(true);
          done();
        })
        .catch(() => {
          done.fail('Should not have thrown an exception');
        });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      adminListRequested()(dispatch, () => {})
        .then(() => {
          expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
          done();
        })
        .catch(() => {
          done.fail('Should have handled the exception');
        });
    });
  });

  describe('adminUpdateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'put').withArgs('/branches/123/admins/789');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve());
      adminUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'ADMIN_UPDATED', payload: { admin: { id: '789', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      adminUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('adminCreateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'post').withArgs('/branches/123/admins');
    });

    it('should dispatch a successful create', done => {
      request.returns(Promise.resolve({ data: { id: '123', name: 'some name' } }));
      adminCreateRequested({ name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'ADMIN_CREATED', payload: { admin: { id: '123', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      adminCreateRequested({ name: 'some name' })(dispatch, () => {})
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
