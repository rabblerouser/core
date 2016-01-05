'use strict';

const specHelper = require("../../support/specHelper"),
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      memberService = require("../../../services/memberService");

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    describe("newMemberHandler", () => {
        let newMemberHandler,
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
                    gender: "detective genius",
                    dateOfBirth: "22 December 1900",
                    primaryPhoneNumber: "0396291146",
                    secondaryPhoneNumber: "0394291146",
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress
                }
            };

            createMemberPromise = Q.defer();
            createMemberStub
                .withArgs(goodRequest.body)
                .returns(createMemberPromise.promise);

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
                    gender: "detective genius",
                    dateOfBirth: "22 December 1900",
                    primaryPhoneNumber: "0396291146",
                    secondaryPhoneNumber: "0394291146",
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress
                };
            });

            it("creates a new member", (done) => {
                newMemberHandler(goodRequest, res);
                createMemberPromise.promise.finally(() => {
                    expect(memberService.createMember).toHaveBeenCalledWith(expectedMemberCreateValues);
                }).nodeify(done);
            });

            it("responds with success", (done) => {
                newMemberHandler(goodRequest, res);

                createMemberPromise.promise.finally(() => {
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.render).toHaveBeenCalledWith("members/success");
                }).nodeify(done);
            });
        });

        describe("when creating the new member fails", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                createMemberPromise.reject(errorMessage);

                newMemberHandler(goodRequest, res);

                createMemberPromise.promise.finally(() => {
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(responseJsonStub).toHaveBeenCalledWith({error: errorMessage});
                }).nodeify(done);
            });
        });
    });
});
