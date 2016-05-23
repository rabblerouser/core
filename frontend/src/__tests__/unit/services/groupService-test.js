import groupService from '../../../services/groupService';

describe('groupService', () => {
  let server;
  const validData = {
    id: 'valid',
    name: 'name',
    description: 'description',
  };
  const invalidData = {
    invalid: 'invalid',
  };
  const group = {
    id: '5678',
    name: 'name',
    description: 'description',
  };
  const branchId = 1234;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
  });

  afterEach(() => {
    server.restore();
  });

  describe('deleteGroup', () => {
    describe('when the id is valid', () => {
      beforeEach(() => {
        server.respondWith('DELETE', '/branches/1234/groups/5678', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify('good'),
        ]);
      });

      it('should send a request to delete the group from the branch', done => {
        groupService.deleteGroup(group, branchId)
          .then(result => {
            expect(result).toEqual('good');
            done();
          })
          .fail(() => {
            done.fail('Expected promise to succeeed');
          });
      });
    });

    describe('when the remote rejects the request', () => {
      describe('with a 500 server error', () => {
        beforeEach(() => {
          server.respondWith('DELETE', '/branches/1234/groups/5678', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          groupService.deleteGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT AVAILABLE');
              done();
            });
        });
      });

      describe('with a 401 unauthorised error', () => {
        beforeEach(() => {
          server.respondWith('DELETE', '/branches/1234/groups/5678', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          groupService.deleteGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });
      });

      describe('with a 404 not found error', () => {
        beforeEach(() => {
          server.respondWith('DELETE', '/branches/1234/groups/5678', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          groupService.deleteGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });
      });
    });
  });

  describe('createGroup', () => {
    describe('when the group provided is valid', () => {
      beforeEach(() => {
        server.respondWith('POST', '/branches/1234/groups', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(validData),
        ]);
      });

      it('should send a request to save a new group for the branch', done => {
        groupService.createGroup(group, branchId)
          .then(result => {
            expect(result).toEqual(validData);
            done();
          })
          .fail(() => {
            done.fail('Expected promise to succeeed');
          });
      });
    });

    describe('when the group returns but in an invalid format', () => {
      beforeEach(() => {
        server.respondWith('POST', '/branches/1234/groups', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(invalidData),
        ]);
      });

      it('should return an error that return data was invalid', done => {
        groupService.createGroup(group, branchId)
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail(error => {
            expect(error.message).toEqual('NOT AVAILABLE');
            done();
          });
      });
    });

    describe('when the remote rejects the request', () => {
      describe('with a 500 server error', () => {
        beforeEach(() => {
          server.respondWith('POST', '/branches/1234/groups', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          groupService.createGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT AVAILABLE');
              done();
            });
        });
      });

      describe('with a 401 unauthorised error', () => {
        beforeEach(() => {
          server.respondWith('POST', '/branches/1234/groups', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          groupService.createGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });
      });

      describe('with a 404 not found error', () => {
        beforeEach(() => {
          server.respondWith('POST', '/branches/1234/groups', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          groupService.createGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });
      });
    });
  });

  describe('updateGroup', () => {
    describe('when the group provided is valid', () => {
      beforeEach(() => {
        server.respondWith('PUT', '/branches/1234/groups/5678', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(validData),
        ]);
      });

      it('should send a request to update the group for the branch', done => {
        groupService.updateGroup(group, branchId)
          .then(result => {
            expect(result).toEqual(validData);
            done();
          })
          .fail(() => {
            done.fail('Expected promise to succeeed');
          });
      });
    });

    describe('when the group returns but in an invalid format', () => {
      beforeEach(() => {
        server.respondWith('PUT', '/branches/1234/groups/5678', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(invalidData),
        ]);
      });

      it('should return an error that return data was invalid', done => {
        groupService.updateGroup(group, branchId)
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail(error => {
            expect(error.message).toEqual('NOT AVAILABLE');
            done();
          });
      });
    });

    describe('when the remote rejects the request', () => {
      describe('with a 500 server error', () => {
        beforeEach(() => {
          server.respondWith('PUT', '/branches/1234/groups/5678', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          groupService.updateGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT AVAILABLE');
              done();
            });
        });
      });

      describe('with a 401 unauthorised error', () => {
        beforeEach(() => {
          server.respondWith('PUT', '/branches/1234/groups/5678', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          groupService.updateGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });
      });

      describe('with a 404 not found error', () => {
        beforeEach(() => {
          server.respondWith('PUT', '/branches/1234/groups/5678', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          groupService.updateGroup(group, branchId)
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail(error => {
              expect(error.message).toEqual('NOT FOUND');
              done();
            });
        });
      });
    });
  });
});
