'use strict';
import labService from '../../../services/labService';

describe('labService', () => {

    let labList = [{key: '1', name: 'Geelong'}, {key: '2', name: 'Melbourne'}, {key: '3', name: 'East Melbourne'}];


    describe('getLabGroups', () => {

        beforeEach(() => {
          server.respondWith('GET', '/branches/id/groups',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({groups: labList})]);
        });

    });

    describe('getLabPartipicants', () => {

        beforeEach(() => {
          server.respondWith('GET', '/branches/id/members',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({members: labList})]);
        });
    });

  describe('getMyLabs', () => {

      let server;
      beforeEach(() => {
        server = sinon.fakeServer.create();
        server.respondImmediately = true;
      });

      afterEach(() => {
        server.restore();
      });

      describe('when the labs are retrieved in a valid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({branches: labList})]);
        });

        it('should return a list of the labs', (done) => {
          labService.getMyLabs()
            .then((branches) => {
              expect(branches).toEqual(labList);
            })
            .then(done, done.fail);
        });
      });

      describe('when the labs are retrieved in an invalid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({invalid: labList})]);
        });

        it('should return an error that return data was invalid', (done) => {
          labService.getMyLabs()
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
          server.respondWith('GET', '/admin/branches', [404, {}, '']);
        });

        it('should return an error that the remote endpoint was not found', (done) => {
          labService.getMyLabs()
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
          server.respondWith('GET', '/admin/branches', [500, {}, '']);
        });

        it('should return a general server error', (done) => {
          labService.getMyLabs()
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

  describe('getLabList', () => {


    let server;
    beforeEach(() => {
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
    });

    afterEach(() => {
      server.restore();
    });

    describe('when the labs are retrieved in a valid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({branches: labList})]);
      });

      it('should return a list of the labs', (done) => {
        labService.getLabList()
          .then((branches) => {
            expect(branches).toEqual(labList);
          })
          .then(done, done.fail);
      });
    });

    describe('when the labs are retrieved in an invalid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({invalid: labList})]);
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
