'use strict';
import labService from '../../../services/labService';

describe('labService', () => {

    let validData = {data: 'valid'};
    let invalidData = {data: 'invalid'};

    describe('getLabGroups', () => {

        let validGroupsPayload =
            [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    name: 'Tuesday',
                    description: 'Hi'
                },
                {
                    id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                    name: 'Wednesday',
                    description: 'Hi'
                }
            ];

        let server;
        beforeEach(() => {
          server = sinon.fakeServer.create();
          server.respondImmediately = true;
        });

        afterEach(() => {
          server.restore();
        });

        describe('when the groups are retrieved in a valid format', () => {

            beforeEach(() => {
                server.respondWith('GET', '/branches/112-11-21-2/groups',
                          [200, { 'Content-Type': 'application/json' },
                           JSON.stringify({groups: validGroupsPayload})]);
            });

          it('should return a list of the labs', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then((groups) => {
                expect(groups).toEqual(validGroupsPayload);
              })
              .then(done, done.fail);
          });
        });

        describe('when the branch id is undefined', () => {
            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabGroups()
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });
        });

        describe('when the groups are retrieved in an invalid format', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/groups',
                        [200, { 'Content-Type': 'application/json' },
                         JSON.stringify({invalid: invalidData})]);
          });

          it('should return an error that return data was invalid', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });
          });
        });

        describe('when the remote groups are 401 unauthorised', () => {

            beforeEach(() => {
              server.respondWith('GET', '/branches/112-11-21-2/groups', [401, {}, '']);
            });

            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabGroups('112-11-21-2')
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });

        });

        describe('when the remote groups are 404 not found', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/groups', [404, {}, '']);
          });

          it('should return an error that the remote endpoint was not found', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT FOUND');
                done();
              });
          });

        });

        describe('when the remote returns a 500 server error', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/groups', [500, {}, '']);
          });

          it('should return a general server error', (done) => {
            labService.getLabGroups('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });

          });

        });

    });

    describe('getLabPartipicants', () => {

        let server;
        beforeEach(() => {
          server = sinon.fakeServer.create();
          server.respondImmediately = true;
        });

        afterEach(() => {
          server.restore();
        });

        describe('when the participants are retrieved in a valid format', () => {

            beforeEach(() => {
                server.respondWith('GET', '/branches/112-11-21-2/members',
                          [200, { 'Content-Type': 'application/json' },
                           JSON.stringify({members: validData})]);
            });

          it('should return a list of the labs', (done) => {
            labService.getLabPartipicants('112-11-21-2')
              .then((participants) => {
                expect(participants).toEqual(validData);
              })
              .then(done, done.fail);
          });
        });

        describe('when the branch id is undefined', () => {
            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabPartipicants()
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });
        });

        describe('when the participants are retrieved in an invalid format', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/members',
                        [200, { 'Content-Type': 'application/json' },
                         JSON.stringify({invalid: invalidData})]);
          });

          it('should return an error that return data was invalid', (done) => {
            labService.getLabPartipicants('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('INVALID PARTICIPANT LIST');
                done();
              });
          });
        });


        describe('when the remote participants are 404 not found', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/members', [404, {}, '']);
          });

          it('should return an error that the remote endpoint was not found', (done) => {
            labService.getLabPartipicants('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT FOUND');
                done();
              });
          });

        });

        describe('when the remote participants are 401 unauthorised', () => {

            beforeEach(() => {
              server.respondWith('GET', '/branches/112-11-21-2/members', [401, {}, '']);
            });

            it('should return an error that the remote endpoint was not found', (done) => {
              labService.getLabPartipicants('112-11-21-2')
                .then(() => {
                  done.fail('Expected promise to be rejected');
                })
                .fail((error) => {
                  expect(error.message).toEqual('NOT FOUND');
                  done();
                });
            });

        });

        describe('when the remote returns a 500 server error', () => {

          beforeEach(() => {
            server.respondWith('GET', '/branches/112-11-21-2/members', [500, {}, '']);
          });

          it('should return a general server error', (done) => {
            labService.getLabPartipicants('112-11-21-2')
              .then(() => {
                done.fail('Expected promise to be rejected');
              })
              .fail((error) => {
                expect(error.message).toEqual('NOT AVAILABLE');
                done();
              });

          });

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
                       JSON.stringify({branches: validData})]);
        });

        it('should return a list of the labs', (done) => {
          labService.getMyLabs()
            .then((branches) => {
              expect(branches).toEqual(validData);
            })
            .then(done, done.fail);
        });
      });

      describe('when the labs are retrieved in an invalid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admin/branches',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({invalid: invalidData})]);
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
              expect(error.message).toEqual('NOT FOUND');
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
              expect(error.message).toEqual('NOT AVAILABLE');
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
                     JSON.stringify({branches: validData})]);
      });

      it('should return a list of the labs', (done) => {
        labService.getLabList()
          .then((branches) => {
            expect(branches).toEqual(validData);
          })
          .then(done, done.fail);
      });
    });

    describe('when the labs are retrieved in an invalid format', () => {

      beforeEach(() => {
        server.respondWith('GET', '/branches',
                    [200, { 'Content-Type': 'application/json' },
                     JSON.stringify({invalid: invalidData})]);
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
            expect(error.message).toEqual('NOT FOUND');
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
            expect(error.message).toEqual('NOT AVAILABLE');
            done();
          });

      });
    });
  });
});
