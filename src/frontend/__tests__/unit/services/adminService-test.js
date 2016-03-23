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
