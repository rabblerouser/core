'use strict';

const specHelper = require("../../support/specHelper"),
    sinon = specHelper.sinon,
    Q = specHelper.Q,
    invoiceService = require("../../../services/invoiceService"),
    paymentValidator = require("../../../lib/paymentValidator"),
    logger = specHelper.logger,
    ChargeCardError = specHelper.ChargeCardError;

var invoicesController = require("../../../controllers/invoicesController");

describe("invoicesController", () => {
    describe("newInvoiceHandler", () => {
        let newInvoiceHandler,
            goodRequest, res,
            statusStub, responseJsonStub,
            payForInvoiceStub, payForInvoicePromise,
            validatePaymentStub,
            expectedInvoiceValues, loggerStub,
            renderStub, renderLocationStub;

        beforeEach(() => {
            newInvoiceHandler = invoicesController.newInvoiceHandler;
            payForInvoiceStub = sinon.stub(invoiceService, 'payForInvoice');
            validatePaymentStub = sinon.stub(paymentValidator, 'isValid');
            loggerStub = sinon.stub(logger, 'logError');

            goodRequest = {
                body: {
                    memberEmail: "sherlock@holmes.co.uk",
                    totalAmount: 60.1,
                    paymentType: 'stripe',
                    stripeToken: 'token',
                    invoiceId: 1
                }
            };

            expectedInvoiceValues = {
                totalAmount: 60.1,
                paymentType: 'stripe',
                stripeToken: 'token',
                invoiceId: 1
            };

            payForInvoicePromise = Q.defer();
            payForInvoiceStub
                .withArgs(expectedInvoiceValues)
                .returns(payForInvoicePromise.promise);

            statusStub = sinon.stub();
            responseJsonStub = sinon.stub();
            renderLocationStub = sinon.stub();
            renderStub = sinon.stub();
            statusStub.returns({render: renderLocationStub, json: responseJsonStub});
            res = {status: statusStub, render: renderStub};
        });

        afterEach(() => {
            invoiceService.payForInvoice.restore();
            paymentValidator.isValid.restore();
            logger.logError.restore();
        });

        describe("when it receives a good request", () => {
            it("responds with success", (done) => {
                validatePaymentStub.returns([]);
                payForInvoicePromise.resolve();

                newInvoiceHandler(goodRequest, res)
                    .finally(() => {
                        expect(res.status).toHaveBeenCalledWith(200);
                    }).nodeify(done);
            });
        });

        describe("when validation fails", () => {
            it("responds with status 400", (done) => {
                validatePaymentStub.returns(["totalAmount"]);
                newInvoiceHandler(goodRequest, res);

                expect(invoiceService.payForInvoice).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                done();
            });
        });

        describe("when pay for invoice fails", () => {
            it("responds with a server error", (done) => {
                validatePaymentStub.returns([]);
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                payForInvoicePromise.reject(errorMessage);

                newInvoiceHandler(goodRequest, res)
                    .finally(() => {
                        expect(logger.logError).toHaveBeenCalled();
                        expect(res.status).toHaveBeenCalledWith(500);
                        expect(responseJsonStub).toHaveBeenCalledWith({errors: "Internal Server Error"});
                    }).nodeify(done);
            });

            it("responds with a bad request if charge card failed", (done) => {
                validatePaymentStub.returns([]);
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                let error = new ChargeCardError(errorMessage);

                payForInvoicePromise.reject(error);

                newInvoiceHandler(goodRequest, res)
                    .finally(() => {
                        expect(logger.logError).not.toHaveBeenCalled();
                        expect(res.status).toHaveBeenCalledWith(400);
                        expect(responseJsonStub).toHaveBeenCalledWith({errors: errorMessage});
                    }).nodeify(done);
            });
        });
    });
});
