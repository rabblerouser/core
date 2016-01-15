"use strict";

const specHelper = require("../../support/specHelper"),
      stripeController = require("../../../controllers/stripeController"),
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
        loggerStub = sinon.stub(logger, 'logNewInvoiceEvent');

        newInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmount: 60,
          paymentType: 'deposit',
        };

        expectedNewInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmountInCents: 6000,
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
                expect(logger.logNewInvoiceEvent).toHaveBeenCalledWith(newInvoice);
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

    describe("Charge card", () => {
        let stripeControllerStub, stripeChargePromise,
            stripeToken="47", totalAmount = 123,
            loggerStub;

        beforeEach(() => {
            stripeControllerStub = sinon.stub(stripeController, "chargeCard");
            stripeChargePromise = Q.defer();
            stripeControllerStub.returns(stripeChargePromise.promise);

            loggerStub = sinon.stub(logger, 'logNewChargeEvent');
        });

        afterEach(() => {
            stripeController.chargeCard.restore();
            loggerStub.restore();
        });

        it("After charge, logger should log", (done) => {
            stripeChargePromise.resolve();

            let promise = invoiceService.chargeCard(stripeToken, totalAmount);

            promise.finally(() => {
                expect(logger.logNewChargeEvent).toHaveBeenCalledWith(stripeToken);
                done();
            });
        });

        it("If charge card fails, logger should still log", (done) => {
            stripeChargePromise.reject();

            let promise = invoiceService.chargeCard(stripeToken, totalAmount);

            promise.finally(() => {
                expect(logger.logNewChargeEvent).toHaveBeenCalledWith(stripeToken);
                done();
            });
        });
    });
});
