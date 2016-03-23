'use strict';
import adminService from '../../../services/adminService';

describe('adminService', () => {

    let server;
    let validData = {
        id: '5678',
        email: 'jim@jim.com',
        phoneNumber: undefined,
        name: undefined
    };
    let invalidData = {
        invalid: 'invalid'
    };
    let admin = {
        id: '5678',
        email: 'jim@jim.com'
    };
    let lab = 1234;

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
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify('good')
                ]);
            });

            it('should send a request to delete the admin from the lab', (done) => {

                adminService.deleteNetworkAdmin(admin)
                    .then((result) => {
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
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    adminService.deleteNetworkAdmin(admin)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('DELETE', '/admins/5678', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.deleteNetworkAdmin(admin)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('DELETE', '/admins/5678', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.deleteNetworkAdmin(admin)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
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
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(validData)
                ]);
            });

            it('should send a request to update the admin for the branch', (done) => {

                adminService.updateNetworkAdmin(admin)
                    .then((result) => {
                        expect(result).toEqual(validData);
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });
        });

        describe('when the admin returns but in an invalid format', () => {

            beforeEach(() => {
                server.respondWith('PUT', '/admins/5678', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(invalidData)
                ]);
            });


            it('should return an error that return data was invalid', (done) => {

                adminService.updateNetworkAdmin(admin)
                    .then(() => {
                        done.fail('Expected promise to be rejected');
                    })
                    .fail((error) => {
                        expect(error.message).toEqual('NOT AVAILABLE');
                        done();
                    });
            });
        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('PUT', '/admins/5678', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    adminService.updateNetworkAdmin(admin)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('PUT', '/admins/5678', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.updateNetworkAdmin(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('PUT', '/admins/5678', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.updateNetworkAdmin(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
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
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(validData)
                ]);
            });

            it('should send a request to save a new admin for the branch', (done) => {

                adminService.createNetworkAdmin(admin, lab)
                    .then((result) => {
                        expect(result).toEqual(validData);
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });

        });

        describe('when the admin returns but in an invalid format', () => {

            beforeEach(() => {
                server.respondWith('POST', '/admins', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(invalidData)
                ]);
            });


            it('should return an error that return data was invalid', (done) => {

                adminService.createNetworkAdmin(admin, lab)
                    .then(() => {
                        done.fail('Expected promise to be rejected');
                    })
                    .fail((error) => {
                        expect(error.message).toEqual('NOT AVAILABLE');
                        done();
                    });
            });
        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('POST', '/admins', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    adminService.createNetworkAdmin(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('POST', '/admins', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.createNetworkAdmin(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('POST', '/admins', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.createNetworkAdmin(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });
        });
    });

    describe('getNetworkAdmins', () => {

        let validAdminPayload =
            [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    email: 'jim@jim.com',
                    name: undefined,
                    phoneNumber: undefined,

                },
                {
                    id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                    email: 'jim@jim.com',
                    name: undefined,
                    phoneNumber: undefined,
                }
            ];

      describe('when the admins are retrieved in a valid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admins',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({admins: validAdminPayload})]);
        });

        it('should return a list of the labs', (done) => {
          adminService.getNetworkAdmins()
            .then((admins) => {
              expect(admins).toEqual(validAdminPayload);
            })
            .then(done, done.fail);
        });
      });

      describe('when the admins are retrieved in an invalid format', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admins',
                      [200, { 'Content-Type': 'application/json' },
                       JSON.stringify({invalid: invalidData})]);
        });

        it('should return an error that return data was invalid', (done) => {
          adminService.getNetworkAdmins()
            .then(() => {
              done.fail('Expected promise to be rejected');
            })
            .fail((error) => {
              expect(error.message).toEqual('NOT AVAILABLE');
              done();
            });
        });
      });


      describe('when the remote admins are 404 not found', () => {

        beforeEach(() => {
          server.respondWith('GET', '/admins', [404, {}, '']);
        });

        it('should return an error that the remote endpoint was not found', (done) => {
          adminService.getNetworkAdmins()
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
          server.respondWith('GET', '/admins', [500, {}, '']);
        });

        it('should return a general server error', (done) => {
          adminService.getNetworkAdmins()
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

    describe('delete', () => {

        describe('when the id is valid', () => {
            beforeEach(() => {
                server.respondWith('DELETE', '/branches/1234/admins/5678', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify('good')
                ]);
            });

            it('should send a request to delete the admin from the lab', (done) => {

                adminService.delete(admin, lab)
                    .then((result) => {
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
                    server.respondWith('DELETE', '/branches/1234/admins/5678', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    adminService.delete(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('DELETE', '/branches/1234/admins/5678', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.delete(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('DELETE', '/branches/1234/admins/5678', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.delete(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

        });
    });

    describe('create', () => {

        describe('when the admin provided is valid', () => {

            beforeEach(() => {
                server.respondWith('POST', '/branches/1234/admins', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(validData)
                ]);
            });

            it('should send a request to save a new admin for the branch', (done) => {

                adminService.create(admin, lab)
                    .then((result) => {
                        expect(result).toEqual(validData);
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });

        });

        describe('when the admin returns but in an invalid format', () => {

            beforeEach(() => {
                server.respondWith('POST', '/branches/1234/admins', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(invalidData)
                ]);
            });


            it('should return an error that return data was invalid', (done) => {

                adminService.create(admin, lab)
                    .then(() => {
                        done.fail('Expected promise to be rejected');
                    })
                    .fail((error) => {
                        expect(error.message).toEqual('NOT AVAILABLE');
                        done();
                    });
            });
        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('POST', '/branches/1234/admins', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    adminService.create(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('POST', '/branches/1234/admins', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.create(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('POST', '/branches/1234/admins', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.create(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
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
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(validData)
                ]);
            });

            it('should send a request to update the admin for the branch', (done) => {

                adminService.update(admin, lab)
                    .then((result) => {
                        expect(result).toEqual(validData);
                        done();
                    })
                    .fail(() => {
                        done.fail('Expected promise to succeeed');
                    });
            });
        });

        describe('when the admin returns but in an invalid format', () => {

            beforeEach(() => {
                server.respondWith('PUT', '/branches/1234/admins/5678', [200, {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify(invalidData)
                ]);
            });


            it('should return an error that return data was invalid', (done) => {

                adminService.update(admin, lab)
                    .then(() => {
                        done.fail('Expected promise to be rejected');
                    })
                    .fail((error) => {
                        expect(error.message).toEqual('NOT AVAILABLE');
                        done();
                    });
            });
        });

        describe('when the remote rejects the request', () => {

            describe('with a 500 server error', () => {

                beforeEach(() => {
                    server.respondWith('PUT', '/branches/1234/admins/5678', [500, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return a general server error', (done) => {
                    adminService.update(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT AVAILABLE');
                            done();
                        });
                });
            });

            describe('with a 401 unauthorised error', () => {

                beforeEach(() => {
                    server.respondWith('PUT', '/branches/1234/admins/5678', [401, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.update(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });

            describe('with a 404 not found error', () => {
                beforeEach(() => {
                    server.respondWith('PUT', '/branches/1234/admins/5678', [404, {
                        'Content-Type': 'application/json'
                    }, '']);
                });

                it('should return an error that the remote endpoint was not found', (done) => {
                    adminService.update(admin, lab)
                        .then(() => {
                            done.fail('Expected promise to be rejected');
                        })
                        .fail((error) => {
                            expect(error.message).toEqual('NOT FOUND');
                            done();
                        });
                });
            });
        });
    });
});
