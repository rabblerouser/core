'use strict';

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      sinon = specHelper.sinon,
      Q = specHelper.Q;

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    describe("newMemberHandler", () => {
        const residentialAddressId = 1;
        const postalAddressId = 2;
        const residentialAddressFromDb = [
            {
                dataValues: {
                    id: residentialAddressId
                }
            }
        ];
        const postalAddressFromDb = [
            {
                dataValues: {
                    id: postalAddressId
                }
            }
        ];

        let next,
            newMemberHandler,
            goodRequest, res,
            addressStub, memberStub, statusStub, responseJsonStub,
            residentialAddress, postalAddress,
            residentialAddressPromise, postalAddressPromise, memberPromise;

        beforeEach((done) => {
            newMemberHandler = membersController.newMemberHandler;
            memberStub = sinon.stub(models.Member, 'create');
            addressStub = sinon.stub(models.Address, 'findOrCreate');

            residentialAddress = {
                address: "221b Baker St",
                suburb: "London",
                country: "England",
                state: "VIC",
                postcode: "1234"
            };
            postalAddress = {
                address: "47 I dont want your spam St",
                suburb: "Moriarty",
                country: "USA",
                state: "NM",
                postcode: "5678"
            };

            goodRequest = {
                body: {
                    firstName: "Sherlock",
                    lastName: "Holmes",
                    email: "sherlock@holmes.co.uk",
                    dateOfBirth: "22 December 1900",
                    phoneNumber: "0396291146",
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress
                }
            };

            residentialAddressPromise = Q.defer();
            addressStub
                .withArgs({where: residentialAddress, defaults: residentialAddress})
                .returns(residentialAddressPromise.promise);

            postalAddressPromise = Q.defer();
            addressStub
                .withArgs({where: postalAddress, defaults: postalAddress})
                .returns(postalAddressPromise.promise);

            memberPromise = Q.defer();
            memberStub.returns(memberPromise.promise);

            next = sinon.stub();
            statusStub = sinon.stub();
            responseJsonStub = sinon.stub();
            statusStub.returns({json: responseJsonStub});
            res = {status: statusStub};

            done();
        });

        afterEach((done) => {
            models.Member.create.restore();
            models.Address.findOrCreate.restore();

            done();
        });

        describe("when it receives a good request", () => {
            let expectedMemberCreateValues = {};

            beforeEach((done) => {
                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.resolve(postalAddressFromDb);
                memberPromise.resolve();

                expectedMemberCreateValues = {
                    firstName: "Sherlock",
                    lastName: "Holmes",
                    email: "sherlock@holmes.co.uk",
                    dateOfBirth: "22 December 1900",
                    phoneNumber: "0396291146",
                    residentialAddress: residentialAddressId,
                    postalAddress: postalAddressId
                };
                done();
            });

            it("calls next", (done) => {
                newMemberHandler(goodRequest, res, next);

                residentialAddressPromise.promise.then(() => {
                    postalAddressPromise.promise.then(() => {
                        memberPromise.promise.then(() => {
                            expect(next).toHaveBeenCalled();
                        }).nodeify(done);
                    });
                });
            });

            it("creates a new member", (done) => {
                newMemberHandler(goodRequest, res, next);
                residentialAddressPromise.promise.then(() => {
                    postalAddressPromise.promise.then(() => {
                        expect(models.Member.create).toHaveBeenCalledWith(expectedMemberCreateValues);
                    }).nodeify(done);
                });
            });

            describe("when postal and residential address are identical", () => {
                it("set them both to same value", (done) => {
                    goodRequest.body.postalAddress = goodRequest.body.residentialAddress;
                    expectedMemberCreateValues.postalAddress = residentialAddressId

                    newMemberHandler(goodRequest, res, next);
                    residentialAddressPromise.promise.then(() => {
                        postalAddressPromise.promise.then(() => {
                            expect(models.Member.create).toHaveBeenCalledWith(expectedMemberCreateValues);
                        }).nodeify(done);
                    });
                });
            });

            it("responds with success", (done) => {
                newMemberHandler(goodRequest, res, next);
                residentialAddressPromise.promise.then(() => {
                    postalAddressPromise.promise.then(() => {
                        memberPromise.promise.then(() => {
                            expect(res.status).toHaveBeenCalledWith(200);
                            expect(responseJsonStub).toHaveBeenCalledWith(null);
                        }).nodeify(done);
                    });
                });
            });
        });

        describe("an error when saving the residential address to the databse", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Yes, we have no bananas.";
                residentialAddressPromise.reject(errorMessage);

                var subjectUnderTest = Q.fbind((goodRequest, res, next) => {
                    return newMemberHandler(goodRequest, res, next);
                });

                subjectUnderTest(goodRequest, res, next).then(() => {
                    residentialAddressPromise.promise.fail(() => {
                        expect(models.Member.create).not.toHaveBeenCalled();
                        expect(next).toHaveBeenCalled();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(responseJsonStub).toHaveBeenCalledWith({error: errorMessage});
                    }).nodeify(done);
                });
            });
        });

        describe("an error when saving the postal address to the databse", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Yes, we have no horses.";
                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.reject(errorMessage);

                var subjectUnderTest = Q.fbind((goodRequest, res, next) => {
                    return newMemberHandler(goodRequest, res, next);
                });

                subjectUnderTest(goodRequest, res, next).then(() => {
                    residentialAddressPromise.promise.then(() => {
                        postalAddressPromise.promise.fail(() => {
                            expect(models.Member.create).not.toHaveBeenCalled();
                            expect(next).toHaveBeenCalled();
                            expect(res.status).toHaveBeenCalledWith(500);
                            expect(responseJsonStub).toHaveBeenCalledWith({error: errorMessage});
                        }).nodeify(done);
                    });
                });
            });
        });

        describe("an error when saving the member to the databse", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.resolve(postalAddressFromDb);
                memberPromise.reject(errorMessage);

                var subjectUnderTest = Q.fbind((goodRequest, res, next) => {
                    return newMemberHandler(goodRequest, res, next);
                });

                subjectUnderTest(goodRequest, res, next).then(() => {
                    residentialAddressPromise.promise.then(() => {
                        postalAddressPromise.promise.then(() => {
                            memberPromise.promise.fail(() => {
                                expect(next).toHaveBeenCalled();
                                expect(res.status).toHaveBeenCalledWith(500);
                                expect(responseJsonStub).toHaveBeenCalledWith({error: errorMessage});
                            }).nodeify(done);
                        });
                    });
                });
            });
        });
    });
});
