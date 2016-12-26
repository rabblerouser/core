import axios from 'axios';

import {
  networkAdminListRequested,
  networkAdminRemoveRequested,
  networkAdminCreateRequested,
  networkAdminUpdateRequested,
 } from '../actions';

describe('networkAdmin/networkAdminsView/actions', () => {
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

  describe('networkAdminRemoveRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'delete').withArgs('/admins/111');
    });

    it('should dispatch a successful remove', done => {
      request.returns(Promise.resolve());
      networkAdminRemoveRequested('111')(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'NETWORK_ADMIN_REMOVED',
          payload: { networkAdminId: '111' },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      networkAdminRemoveRequested(111)(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('networkAdminListRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'get').withArgs('/admins');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve({ data: { admins: [{ id: '111' }] } }));
      networkAdminListRequested()(dispatch, () => {})
        .then(() => {
          expect(dispatch.calledWithMatch({
            type: 'NETWORK_ADMIN_LIST_UPDATED', payload: { networkAdmins: [{ id: '111' }] },
          })).toEqual(true);
          done();
        })
        .catch(() => {
          done.fail('Should not have thrown an exception');
        });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      networkAdminListRequested()(dispatch, () => {})
        .then(() => {
          expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
          done();
        })
        .catch(() => {
          done.fail('Should have handled the exception');
        });
    });
  });

  describe('networkAdminUpdateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'put').withArgs('/admins/789');
    });

    it('should dispatch a successful update', done => {
      request.returns(Promise.resolve());
      networkAdminUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'NETWORK_ADMIN_UPDATED', payload: { networkAdmin: { id: '789', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      networkAdminUpdateRequested({ id: '789', name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({ type: 'REPORT_FAILURE' })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should have handled the exception');
      });
    });
  });

  describe('networkAdminCreateRequested', () => {
    beforeEach(() => {
      request = sandbox.stub(axios, 'post').withArgs('/admins');
    });

    it('should dispatch a successful create', done => {
      request.returns(Promise.resolve({ data: { id: '123', name: 'some name' } }));
      networkAdminCreateRequested({ name: 'some name' })(dispatch, () => {})
      .then(() => {
        expect(dispatch.calledWithMatch({
          type: 'NETWORK_ADMIN_CREATED', payload: { networkAdmin: { id: '123', name: 'some name' } },
        })).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail('Should not have thrown an exception');
      });
    });

    it('should report a failure when the request fails', done => {
      request.returns(Promise.reject());
      networkAdminCreateRequested({ name: 'some name' })(dispatch, () => {})
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
