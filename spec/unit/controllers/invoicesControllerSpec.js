'use strict';

const specHelper = require("../../support/specHelper"),
    sinon = specHelper.sinon,
    Q = specHelper.Q;

var invoiceService = require("../../../services/invoiceService");

var invoicesController = require("../../../controllers/invoicesController");

describe("invoicesController", () => {
    describe("newInvoiceHandler", () => {
        let newInvoiceHandler,
            goodRequest, res,
            statusStub, responseJsonStub,
            createInvoiceStub, createInvoicePromise,
            chargeCardStub, chargeCardPromise,
            renderStub, renderLocationStub;

        beforeEach(() => {
            newInvoiceHandler = invoicesController.newInvoiceHandler;
            createInvoiceStub = sinon.stub(invoiceService, 'createInvoice');
            chargeCardStub = sinon.stub(invoiceService, 'chargeCard');

            goodRequest = {
                body: {
                    memberEmail: "sherlock@holmes.co.uk",
                    totalAmount: 60,
                    paymentType: 'deposit'
                }
            };

            createInvoicePromise = Q.defer();
            createInvoiceStub
                .withArgs(goodRequest.body)
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
        });

        describe("when it receives a good request", () => {
            let expectedInvoiceCreateValues;

            beforeEach(() => {
                createInvoicePromise.resolve();

                expectedInvoiceCreateValues = {
                    memberEmail: "sherlock@holmes.co.uk",
                    totalAmount: 60,
                    paymentType: 'deposit'
                };
            });

            it("creates a charge card if stripe payment type", (done) => {
                createInvoiceStub.returns(createInvoicePromise.promise);

                chargeCardPromise.resolve({id: "123"});

                goodRequest.body.paymentType = 'stripe';
                goodRequest.body.stripeToken = {id: '1'};
                expectedInvoiceCreateValues.paymentType = 'stripe';
                expectedInvoiceCreateValues.reference = '123';

                newInvoiceHandler(goodRequest, res);

                chargeCardPromise.promise.finally(() => {
                    expect(invoiceService.chargeCard).toHaveBeenCalledWith({id: '1'}, 60);
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                }).nodeify(done);
            });

            it("doesn't creates a charge card if not stripe payment type", (done) => {
                createInvoiceStub.returns(createInvoicePromise.promise);

                chargeCardPromise.resolve();

                newInvoiceHandler(goodRequest, res);

                chargeCardPromise.promise.finally(() => {
                    expect(invoiceService.chargeCard).not.toHaveBeenCalled();
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                }).nodeify(done);
            });

            it("creates a new invoice", (done) => {
                newInvoiceHandler(goodRequest, res);

                createInvoicePromise.promise.finally(() => {
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                }).nodeify(done);
            });

            it("responds with success", (done) => {
                newInvoiceHandler(goodRequest, res);

                createInvoicePromise.promise.finally(() => {
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(renderLocationStub).toHaveBeenCalledWith("members/success");
                }).nodeify(done);
            });
        });

        describe("when validation fails", () => {
            it("responds with status 400", (done) => {
                let badRequest = {
                    body: {
                        memberEmail: "sherlock@holmes.co.uk",
                        totalAmount: 'abd',
                        paymentType: 'deposit'
                    }
                };

                createInvoiceStub
                    .withArgs(badRequest.body)
                    .returns(createInvoicePromise.promise);

                newInvoiceHandler(badRequest, res);

                expect(invoiceService.createInvoice).not.toHaveBeenCalled();
                expect(invoiceService.chargeCard()).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                expect(renderLocationStub).toHaveBeenCalledWith("members/payment", {
                    title: 'Payment',
                    errors: ["totalAmount"],
                    email: "sherlock@holmes.co.uk"
                });
                done();
            });
        });

        describe("when charging card fails", () => {
            it("should return 400 (for now)", (done) => {
                chargeCardPromise.reject("Could not handle payment");

                goodRequest.body.paymentType = "stripe";
                goodRequest.body.stripeToken = "token";

                newInvoiceHandler(goodRequest, res);

                chargeCardPromise.promise.finally(() => {
                    expect(invoiceService.createInvoice).not.toHaveBeenCalled();
                    expect(res.status).toHaveBeenCalledWith(400);
                    expect(responseJsonStub).toHaveBeenCalledWith({errors: ["Failed to charge card"]});
                }).nodeify(done);
            });
        });

        describe("when creating the new invoice fails", () => {
            it("responds with a server error", (done) => {
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
