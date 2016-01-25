'use strict';

const specHelper = require("../../support/specHelper"),
    sinon = specHelper.sinon,
    Q = specHelper.Q;

var invoiceService = require("../../../services/invoiceService"),
    paymentValidator = require("../../../lib/paymentValidator");

var invoicesController = require("../../../controllers/invoicesController");

describe("invoicesController", () => {
    describe("newInvoiceHandler", () => {
        let newInvoiceHandler,
            goodRequest, res,
            statusStub, responseJsonStub,
            createInvoiceStub, createInvoicePromise,
            chargeCardStub, chargeCardPromise,
            validatePaymentStub,
            expectedInvoiceCreateValues,
            renderStub, renderLocationStub;

        beforeEach(() => {
            newInvoiceHandler = invoicesController.newInvoiceHandler;
            createInvoiceStub = sinon.stub(invoiceService, 'createInvoice');
            chargeCardStub = sinon.stub(invoiceService, 'chargeCard');
            validatePaymentStub = sinon.stub(paymentValidator, 'isValid');

            goodRequest = {
                body: {
                    memberEmail: "sherlock@holmes.co.uk",
                    totalAmount: 60.1,
                    paymentType: 'deposit',
                    invoiceId: "1",
                    uuid: "1234",
                    membershipType: "full"
                }
            };

            expectedInvoiceCreateValues = {
                memberEmail: "sherlock@holmes.co.uk",
                totalAmount: 60.1,
                paymentType: 'deposit',
                invoiceId: "1",
                uuid: "1234",
                membershipType: "full"
            };

            createInvoicePromise = Q.defer();
            createInvoiceStub
                .withArgs(expectedInvoiceCreateValues)
                .returns(createInvoicePromise.promise);

            chargeCardPromise = Q.defer();
            chargeCardStub.returns(chargeCardPromise.promise);

            statusStub = sinon.stub();
            responseJsonStub = sinon.stub();
            renderLocationStub = sinon.stub();
            renderStub = sinon.stub();
            statusStub.returns({render: renderLocationStub, json: responseJsonStub});
            res = {status: statusStub, render: renderStub};
        });

        afterEach(() => {
            invoiceService.createInvoice.restore();
            invoiceService.chargeCard.restore();
            paymentValidator.isValid.restore();
        });

        describe("when it receives a good request", () => {

            beforeEach(() => {
                validatePaymentStub.returns([]);
                createInvoicePromise.resolve();
            });

            it("creates a charge card if stripe payment type", (done) => {
                chargeCardPromise.resolve({id: "123"});

                goodRequest.body.paymentType = 'stripe';
                goodRequest.body.stripeToken = {id: '1'};
                expectedInvoiceCreateValues.paymentType = 'stripe';
                expectedInvoiceCreateValues.reference = '123';
                expectedInvoiceCreateValues.paymentStatus = 'Paid';
                expectedInvoiceCreateValues.totalAmount = 60;

                newInvoiceHandler(goodRequest, res);

                chargeCardPromise.promise.finally(() => {
                    expect(invoiceService.chargeCard).toHaveBeenCalledWith('1', 60);
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                }).nodeify(done);
            });

            it("doesn't creates a charge card if not stripe payment type", (done) => {
                newInvoiceHandler(goodRequest, res);

                createInvoicePromise.promise.finally(() => {
                    expect(invoiceService.chargeCard).not.toHaveBeenCalled();
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                }).nodeify(done);
            });

            it("responds with success", (done) => {
                newInvoiceHandler(goodRequest, res);

                createInvoicePromise.promise.finally(() => {
                    expect(res.status).toHaveBeenCalledWith(200);
                }).nodeify(done);
            });
        });

        describe("when validation fails", () => {
            it("responds with status 400", (done) => {
                validatePaymentStub.returns(["totalAmount"]);
                newInvoiceHandler(goodRequest, res);

                expect(invoiceService.createInvoice).not.toHaveBeenCalled();
                expect(invoiceService.chargeCard()).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                done();
            });
        });

        describe("when charging card fails", () => {
            it("should return 400 (for now)", (done) => {
                validatePaymentStub.returns([]);
                chargeCardPromise.reject("Could not handle payment");

                goodRequest.body.paymentType = "stripe";
                goodRequest.body.stripeToken = "token";

                expectedInvoiceCreateValues.paymentType = "stripe";
                expectedInvoiceCreateValues.paymentStatus = "Pending";
                expectedInvoiceCreateValues.totalAmount = 60;

                newInvoiceHandler(goodRequest, res);

                chargeCardPromise.promise.finally(() => {
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                    expect(res.status).toHaveBeenCalledWith(400);
                    expect(responseJsonStub).toHaveBeenCalledWith({errors: "Could not handle payment"});
                }).nodeify(done);
            });
        });

        describe("when creating the new invoice fails", () => {
            it("responds with a server error", (done) => {
                validatePaymentStub.returns([]);
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                createInvoicePromise.reject(errorMessage);

                newInvoiceHandler(goodRequest, res);

                createInvoicePromise.promise.finally(() => {
                    expect(res.status).toHaveBeenCalledWith(500);
                    expect(responseJsonStub).toHaveBeenCalledWith({errors: [errorMessage]});
                }).nodeify(done);
            });
        });
    });
});
