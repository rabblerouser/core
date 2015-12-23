'use strict';

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      sinon = specHelper.sinon,
      Q = specHelper.Q;

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    describe("newMemberHandler", () => {
        const addressId = 1;
        const addressFromDb = [
            {
                dataValues: {
                    id: addressId
                }
            }
        ];

        let next,
            newMemberHandler,
            goodRequest, res,
            addressStub, memberStub, statusStub, responseJsonStub,
            newAddress,
            addressPromise, memberPromise;

        beforeEach((done) => {
            newMemberHandler = membersController.newMemberHandler;
            memberStub = sinon.stub(models.Member, 'create');
            addressStub = sinon.stub(models.Address, 'findOrCreate');

            newAddress = {
                address: "221b Baker St",
                suburb: "London",
                country: "England",
                state: "VIC",
                postcode: "1234"
            };

            goodRequest = {
                body: {
                    firstName: "Sherlock",
                    lastName: "Holmes",
                    email: "sherlock@holmes.co.uk",
                    dateOfBirth: "22 December 1900",
                    phoneNumber: "0396291146",
                    residentialAddress: newAddress,
                    postalAddress: newAddress
                }
            };

            addressPromise = Q.defer();
            addressStub
                .withArgs({where: newAddress, defaults: newAddress})
                .returns(addressPromise.promise);

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
            beforeEach((done) => {
                addressPromise.resolve(addressFromDb);
                memberPromise.resolve();
                done();
            });

            it("calls next", (done) => {
                newMemberHandler(goodRequest, res, next);

                addressPromise.promise.then(() => {
                    memberPromise.promise.then(() => {
                        expect(next).toHaveBeenCalled();
                    }).nodeify(done);
                });
            });

            it("creates a new member", (done) => {
                newMemberHandler(goodRequest, res, next);
                addressPromise.promise.then(() => {
                    expect(models.Member.create).toHaveBeenCalledWith({
                        firstName: "Sherlock",
                        lastName: "Holmes",
                        email: "sherlock@holmes.co.uk",
                        dateOfBirth: "22 December 1900",
                        phoneNumber: "0396291146",
                        residentialAddress: addressId,
                        postalAddress: addressId
                    });
                }).nodeify(done);
            });

            it("responds with success", (done) => {
                newMemberHandler(goodRequest, res, next);
                addressPromise.promise.then(() => {
                    memberPromise.promise.then(() => {
                        expect(res.status).toHaveBeenCalledWith(200);
                        expect(responseJsonStub).toHaveBeenCalledWith(null);
                    }).nodeify(done);
                });
            });
        });

        describe("an error when saving the address to the databse", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Yes, we have no bananas.";
                addressPromise.reject(errorMessage);

                var subjectUnderTest = Q.fbind((goodRequest, res, next) => {
                    return newMemberHandler(goodRequest, res, next);
                });

                subjectUnderTest(goodRequest, res, next).then(() => {
                    addressPromise.promise.fail(() => {
                        expect(models.Member.create).not.toHaveBeenCalled();
                        expect(next).toHaveBeenCalled();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(responseJsonStub).toHaveBeenCalledWith({error: errorMessage});
                    }).nodeify(done);
                });
            });
        });

        describe("an error when saving the member to the databse", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                addressPromise.resolve(addressFromDb);
                memberPromise.reject(errorMessage);

                var subjectUnderTest = Q.fbind((goodRequest, res, next) => {
                    return newMemberHandler(goodRequest, res, next);
                });

                subjectUnderTest(goodRequest, res, next).then(() => {
                    addressPromise.promise.then(() => {
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
