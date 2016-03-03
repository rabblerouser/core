'use strict';
import labService from '../../../services/labService';

describe('labService', () => {

  describe('getLabGroups', () => {

  });

  describe('getLabPartipicants', () => {

  });

  describe('getLabList', () => {

    let branchList = [{key: '1', name: 'Geelong'}, {key: '2', name: 'Melbourne'}, {key: '3', name: 'East Melbourne'}];

    let server;
    beforeEach(() => {
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
    });

    afterEach(() => {
      server.restore();
    });

    describe('when the labs are retreived in a valid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({branches: branchList})]);
      });

      it('should return a list of the labs', (done) => {
        labService.getLabList()
          .then((branches) => {
            expect(branches).toEqual(branchList);
          })
          .then(done, done.fail);
      });
    });

    describe('when the labs are retreived in an invalid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({invalid: branchList})]);
      });

      it('should return an error that return data was invalid', (done) => {
        labService.getLabList()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail((error) => {
            expect(error.message).toEqual('INVALID LAB LIST');
            done();
          });
      });
    });


    describe('when the remote labs are 404 not found', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches', [404, {}, '']);
      });

      it('should return an error that the remote endpoint was not found', (done) => {
        labService.getLabList()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail((error) => {
            expect(error.message).toEqual('LABS NOT FOUND');
            done();
          });
      });

    });

    describe('when the remote returns a 500 server error', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches', [500, {}, '']);
      });

      it('should return a general server error', (done) => {
        labService.getLabList()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail((error) => {
            expect(error.message).toEqual('LABS NOT AVAILABLE');
            done();
          });

      });

    });

  });

});
