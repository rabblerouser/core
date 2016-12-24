import adminService from '../adminService';

describe('adminService', () => {
  let server;
  const validData = {
    id: '5678',
    email: 'jim@jim.com',
  };
  const admin = {
    id: '5678',
    email: 'jim@jim.com',
  };
  const branchId = 1234;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
  });

  afterEach(() => {
    server.restore();
  });

  describe('delete', () => {
    describe('when the id is valid', () => {
      beforeEach(() => {
        server.respondWith('DELETE', '/admins/5678', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify('good'),
        ]);
      });

      it('should send a request to delete the admin from the branch', done => {
        adminService.deleteNetworkAdmin(admin)
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
          server.respondWith('DELETE', '/admins/5678', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          adminService.deleteNetworkAdmin(admin)
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
          server.respondWith('DELETE', '/admins/5678', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.deleteNetworkAdmin(admin)
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
          server.respondWith('DELETE', '/admins/5678', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.deleteNetworkAdmin(admin)
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

  describe('updateNetworkAdmin', () => {
    describe('when the admin provided is valid', () => {
      beforeEach(() => {
        server.respondWith('PUT', '/admins/5678', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(validData),
        ]);
      });

      it('should send a request to update the admin for the branch', done => {
        adminService.updateNetworkAdmin(admin)
          .then(result => {
            expect(result).toEqual(validData);
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
          server.respondWith('PUT', '/admins/5678', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          adminService.updateNetworkAdmin(admin)
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
          server.respondWith('PUT', '/admins/5678', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.updateNetworkAdmin(admin, branchId)
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
          server.respondWith('PUT', '/admins/5678', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.updateNetworkAdmin(admin, branchId)
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

  describe('createNetworkAdmin', () => {
    describe('when the admin provided is valid', () => {
      beforeEach(() => {
        server.respondWith('POST', '/admins', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(validData),
        ]);
      });

      it('should send a request to save a new admin for the branch', done => {
        adminService.createNetworkAdmin(admin, branchId)
          .then(result => {
            expect(result).toEqual(validData);
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
          server.respondWith('POST', '/admins', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          adminService.createNetworkAdmin(admin, branchId)
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
          server.respondWith('POST', '/admins', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.createNetworkAdmin(admin, branchId)
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
          server.respondWith('POST', '/admins', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.createNetworkAdmin(admin, branchId)
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

  describe('getNetworkAdmins', () => {
    const validAdminPayload =
      [
        {
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          email: 'jim@jim.com',

        },
        {
          id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
          email: 'jim@jim.com',
        },
      ];

    describe('when the admins are retrieved in a valid format', () => {
      beforeEach(() => {
        server.respondWith('GET', '/admins',
          [200, { 'Content-Type': 'application/json' },
            JSON.stringify({ admins: validAdminPayload })]);
      });

      it('should return a list of the branches', done => {
        adminService.getNetworkAdmins()
          .then(admins => {
            expect(admins).toEqual(validAdminPayload);
          })
          .then(done, done.fail);
      });
    });

    describe('when the remote admins are 404 not found', () => {
      beforeEach(() => {
        server.respondWith('GET', '/admins', [404, {}, '']);
      });

      it('should return an error that the remote endpoint was not found', done => {
        adminService.getNetworkAdmins()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail(error => {
            expect(error.message).toEqual('NOT FOUND');
            done();
          });
      });
    });

    describe('when the remote returns a 500 server error', () => {
      beforeEach(() => {
        server.respondWith('GET', '/admins', [500, {}, '']);
      });

      it('should return a general server error', done => {
        adminService.getNetworkAdmins()
          .then(() => {
            done.fail('Expected promise to be rejected');
          })
          .fail(error => {
            expect(error.message).toEqual('NOT AVAILABLE');
            done();
          });
      });
    });
  });

  describe('create', () => {
    describe('when the admin provided is valid', () => {
      beforeEach(() => {
        server.respondWith('POST', '/branches/1234/admins', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(validData),
        ]);
      });

      it('should send a request to save a new admin for the branch', done => {
        adminService.create(admin, branchId)
          .then(result => {
            expect(result).toEqual(validData);
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
          server.respondWith('POST', '/branches/1234/admins', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          adminService.create(admin, branchId)
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
          server.respondWith('POST', '/branches/1234/admins', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.create(admin, branchId)
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
          server.respondWith('POST', '/branches/1234/admins', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.create(admin, branchId)
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

  describe('update', () => {
    describe('when the admin provided is valid', () => {
      beforeEach(() => {
        server.respondWith('PUT', '/branches/1234/admins/5678', [200, {
          'Content-Type': 'application/json',
        },
          JSON.stringify(validData),
        ]);
      });

      it('should send a request to update the admin for the branch', done => {
        adminService.update(admin, branchId)
          .then(result => {
            expect(result).toEqual(validData);
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
          server.respondWith('PUT', '/branches/1234/admins/5678', [500, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return a general server error', done => {
          adminService.update(admin, branchId)
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
          server.respondWith('PUT', '/branches/1234/admins/5678', [401, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.update(admin, branchId)
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
          server.respondWith('PUT', '/branches/1234/admins/5678', [404, {
            'Content-Type': 'application/json',
          }, '']);
        });

        it('should return an error that the remote endpoint was not found', done => {
          adminService.update(admin, branchId)
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
