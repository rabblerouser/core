'use strict';

const specHelper = require("../../support/specHelper"),
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      invoiceService = require("../../../services/invoiceService")

var invoicesController = require("../../../controllers/invoicesController");

describe("invoicesController", () => {
    describe("newInvocieHandler", () => {
        let newInvoiceHandler,
            goodRequest, res,
            createInvoiceStub, createInvoicePromise;

        beforeEach(() => {
            newInvoiceHandler = invoicesController.newInvoiceHandler;
            createInvoiceStub = sinon.stub(invoiceService, 'createInvoice');

            goodRequest = {
                body: {
                    email: "sherlock@holmes.co.uk",
                    amount: 60,
                    paymentType: 'deposit'
                }
            };

            createInvoicePromise = Q.defer();
            createInvoiceStub
                .withArgs(goodRequest.body)
                .returns(createInvoicePromise.promise);

            res = {};
        });

        afterEach(() => {
            invoiceService.createInvoice.restore();
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

            it("creates a new invoice", (done) => {
                newInvoiceHandler(goodRequest, res);
                createInvoicePromise.promise.finally(() => {
                    expect(invoiceService.createInvoice).toHaveBeenCalledWith(expectedInvoiceCreateValues);
                }).nodeify(done);
            });
        });
    });
});
