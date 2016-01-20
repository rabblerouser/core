"use strict";

const specHelper = require("../../support/specHelper"),
      stripeHandler = require("../../../lib/stripeHandler"),
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
          reference: ''
        };

        expectedNewInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmountInCents: 6000,
          paymentDate: moment().format('L'),
          paymentType: 'deposit',
          reference: '',
          paymentStatus: 'Pending'
        };

        invoicePromise = Q.defer();
        invoiceStub.returns(invoicePromise.promise);
    });

    afterEach(() => {
        models.Invoice.create.restore();
        loggerStub.restore();
    });

    it("creates a new invoice for pending Payment", (done) => {
        invoicePromise.resolve();

        invoiceService.createInvoice(newInvoice)
            .then(() => {
                expect(Invoice.create).toHaveBeenCalledWith(expectedNewInvoice);
            }).nodeify(done);
    });

    it("creates a new invoice for paid Payment", (done) => {
        invoicePromise.resolve();
        newInvoice.paymentStatus = 'Paid';
        expectedNewInvoice.paymentStatus = 'Paid';

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
      let stripeHandlerStub, stripeChargePromise,
          stripeToken="47", totalAmount = 123,
          loggerStub, failedLoggerStub;

      beforeEach(() => {
          stripeHandlerStub = sinon.stub(stripeHandler, "chargeCard");
          stripeChargePromise = Q.defer();
          stripeHandlerStub.returns(stripeChargePromise.promise);

          loggerStub = sinon.stub(logger, 'logNewChargeEvent');
          failedLoggerStub = sinon.stub(logger, 'logNewFailedCharge');
      });

      afterEach(() => {
          stripeHandler.chargeCard.restore();
          loggerStub.restore();
          failedLoggerStub.restore();
      });

      it("should call charge card handler to charge the card", (done) => {
          stripeChargePromise.resolve();

          let promise = invoiceService.chargeCard(stripeToken, totalAmount);

          promise.finally(() => {
              expect(stripeHandler.chargeCard).toHaveBeenCalledWith(stripeToken, totalAmount);
              done();
          });
      });

      it("After charge, logger should log", (done) => {
          stripeChargePromise.resolve();

          let promise = invoiceService.chargeCard(stripeToken, totalAmount);

          promise.finally(() => {
              expect(logger.logNewChargeEvent).toHaveBeenCalledWith(stripeToken);
              expect(logger.logNewFailedCharge).not.toHaveBeenCalled();
              done();
          });
      });

      it("If charge card fails, logger should log failed event", (done) => {
          let errorMessage = "Charge card failed with Stripe!";
          stripeChargePromise.reject(errorMessage);

          let promise = invoiceService.chargeCard(stripeToken, totalAmount);

          promise.finally(() => {
              expect(promise.isRejected()).toBe(true);
              expect(logger.logNewFailedCharge).toHaveBeenCalledWith(stripeToken, errorMessage);
              done();
          });
      });
  });
});
