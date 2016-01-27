'use strict';

const specHelper = require("../../support/specHelper"),
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      invoiceService = require("../../../services/invoiceService"),
      memberService = require("../../../services/memberService"),
      memberValidator = require("../../../lib/memberValidator");

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    describe("newMemberHandler", () => {
        let newMemberHandler,
            goodRequest, res,
            statusStub, responseJsonStub,
            residentialAddress, postalAddress,
            createMemberStub, createMemberPromise,
            validateMemberStub,
            createInvoiceStub, createInvoicePromise;

        beforeEach(() => {
            newMemberHandler = membersController.newMemberHandler;
            createMemberStub = sinon.stub(memberService, 'createMember');
            createInvoiceStub = sinon.stub(invoiceService, 'createEmptyInvoice');
            validateMemberStub = sinon.stub(memberValidator, 'isValid');

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
                    dateOfBirth: "22/12/1900",
                    primaryPhoneNumber: "0396291146",
                    secondaryPhoneNumber: "0394291146",
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: "full"
                }
            };

            createMemberPromise = Q.defer();
            createMemberStub
                .withArgs(goodRequest.body)
                .returns(createMemberPromise.promise);

            createInvoicePromise = Q.defer();
            createInvoiceStub.returns(createInvoicePromise.promise);

            statusStub = sinon.stub();
            responseJsonStub = sinon.stub();
            statusStub.returns({json: responseJsonStub});
            res = {status: statusStub};

        });

        afterEach(() => {
            memberService.createMember.restore();
            invoiceService.createEmptyInvoice.restore();
            memberValidator.isValid.restore();
        });

        describe("when it receives a good request", () => {
            let expectedMemberCreateValues;

            beforeEach(() => {
                validateMemberStub.returns([]);
                createMemberPromise.resolve({id:"1234", membershipType: "full", email: 'sherlock@holmes.co.uk'});
                createInvoicePromise.resolve({id:"1"});

                expectedMemberCreateValues = {
                    firstName: "Sherlock",
                    lastName: "Holmes",
                    email: "sherlock@holmes.co.uk",
                    gender: "detective genius",
                    dateOfBirth: "22/12/1900",
                    primaryPhoneNumber: "0396291146",
                    secondaryPhoneNumber: "0394291146",
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: "full"
                };
            });

            it("creates a new member", (done) => {
                newMemberHandler(goodRequest, res);
                createMemberPromise.promise.finally(() => {
                    expect(memberService.createMember).toHaveBeenCalledWith(expectedMemberCreateValues);
                    expect(invoiceService.createEmptyInvoice).toHaveBeenCalledWith("sherlock@holmes.co.uk", "FUL1234");
                }).nodeify(done);
            });
        });

        describe("when validation fails", () => {
            it("responds with status 400",(done) => {
                validateMemberStub.returns(["firstName"]);
                newMemberHandler(goodRequest, res);

                expect(memberService.createMember).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                done();
            });
        });
    });
});
