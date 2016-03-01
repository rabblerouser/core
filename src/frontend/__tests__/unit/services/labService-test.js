'use strict';
import labService from '../../../services/labService';

describe('labService', () => {

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

    describe('when the remote labs are successfully retrieved', () => {

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

    describe('when the remote labs are 404 not found', () => {

    });

  });

});
