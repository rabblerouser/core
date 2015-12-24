'use strict';

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      memberService = require("../../../services/memberService");

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    describe("newMemberHandler", () => {
        let next,
            newMemberHandler,
            goodRequest, res,
            statusStub, responseJsonStub,
            residentialAddress, postalAddress,
            createMemberStub, createMemberPromise;

        beforeEach(() => {
            newMemberHandler = membersController.newMemberHandler;
            createMemberStub = sinon.stub(memberService, 'createMember');

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

            createMemberPromise = Q.defer();
            createMemberStub
                .withArgs(goodRequest.body)
                .returns(createMemberPromise.promise);

            next = sinon.stub();
            statusStub = sinon.stub();
            responseJsonStub = sinon.stub();
            statusStub.returns({json: responseJsonStub});
            res = {status: statusStub};
        });

        afterEach(() => {
            memberService.createMember.restore();
        });

        describe("when it receives a good request", () => {
            let expectedMemberCreateValues;

            beforeEach(() => {
                createMemberPromise.resolve();

                expectedMemberCreateValues = {
                    firstName: "Sherlock",
                    lastName: "Holmes",
                    email: "sherlock@holmes.co.uk",
                    dateOfBirth: "22 December 1900",
                    phoneNumber: "0396291146",
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress
                };
            });

            it("calls next", (done) => {
                newMemberHandler(goodRequest, res, next);

                createMemberPromise.promise.finally(() => {
                    expect(next).toHaveBeenCalled();
                }).nodeify(done);
            });

            it("creates a new member", (done) => {
                newMemberHandler(goodRequest, res, next);
                createMemberPromise.promise.finally(() => {
                    expect(memberService.createMember).toHaveBeenCalledWith(expectedMemberCreateValues);
                }).nodeify(done);
            });

            it("responds with success", (done) => {
                newMemberHandler(goodRequest, res, next);

                createMemberPromise.promise.finally(() => {
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(responseJsonStub).toHaveBeenCalledWith(null);
                }).nodeify(done);
            });
        });

        describe("when creating the new member fails", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                createMemberPromise.reject(errorMessage);

                newMemberHandler(goodRequest, res, next);

                createMemberPromise.promise.finally(() => {
                    expect(next).toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(responseJsonStub).toHaveBeenCalledWith({error: errorMessage});
                }).nodeify(done);
            });
        });
    });
});
