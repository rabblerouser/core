"use strict";

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      Invoice = models.Invoice,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      logger = specHelper.logger,
      moment = require('moment');

var invoiceService = require("../../../services/invoiceService");

describe('invoiceService', () => {

  describe("createInvoice", () => {

    let invoiceStub, loggerStub,
        newInvoice, expectedNewInvoice,
        invoicePromise;

    beforeEach(() => {
        invoiceStub = sinon.stub(models.Invoice, 'create');
        loggerStub = sinon.stub(logger, 'info');

        newInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmount: 60,
          paymentType: 'deposit',
        };

        expectedNewInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmount: 6000,
          paymentDate: moment().format('L'),
          paymentType: 'deposit',
          reference: ''
        };

        invoicePromise = Q.defer();
        invoiceStub.returns(invoicePromise.promise);
    });

    afterEach(() => {
        models.Invoice.create.restore();
        loggerStub.restore();
    });

    it("creates a new invoice", (done) => {
        invoicePromise.resolve();

        invoiceService.createInvoice(newInvoice)
            .then(() => {
                expect(Invoice.create).toHaveBeenCalledWith(expectedNewInvoice);
            }).nodeify(done);
    });

    it("logs the invoice creation event", (done) => {
        invoicePromise.resolve();

        invoiceService.createInvoice(newInvoice)
            .then(() => {
                expect(logger.info).toHaveBeenCalledWith(newInvoice);
            }).nodeify(done);
    });

    describe("an error when saving the invoice to the database", () => {
        it("rejects the promise", (done) => {
            let errorMessage = "Seriously, we still don't have any damn bananas.";
            invoicePromise.reject(errorMessage);

            let promise = invoiceService.createInvoice(newInvoice);

            promise.finally(() => {
                expect(promise.isRejected()).toBe(true);
                done();
            });
        });
    });
  });
});
