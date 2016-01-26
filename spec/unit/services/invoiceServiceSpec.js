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
    let createInvoiceStub, updateInvoiceStub,
        findInvoiceStub, newInvoiceloggerStub,
        updateInvoiceloggerStub, newInvoice,
        expectedNewInvoice, createInvoicePromise,
        updateInvoicePromise, findInvoicePromise,
        createEmptyInvoiceloggerStub, memberEmail, reference;;

    beforeEach(() => {
        createInvoiceStub = sinon.stub(models.Invoice, 'create');
        updateInvoiceStub = sinon.stub(models.Invoice, 'update');
        findInvoiceStub = sinon.stub(models.Invoice, 'findById');
        newInvoiceloggerStub = sinon.stub(logger, 'logNewInvoiceEvent');
        updateInvoiceloggerStub = sinon.stub(logger, 'logUpdateInvoiceEvent');
        createEmptyInvoiceloggerStub = sinon.stub(logger, 'logCreateEmptyInvoiceEvent');

        newInvoice = {
          memberEmail: "sherlock@holmes.co.uk",
          totalAmount: 60,
          paymentType: "deposit",
          uuid: "1234",
          membershipType: "full"
        };

        expectedNewInvoice = {};

        memberEmail = "sherlock@holmes.co.uk";
        reference = "FUL1234";

        createInvoicePromise = Q.defer();
        createInvoiceStub.returns(createInvoicePromise.promise);

        updateInvoicePromise = Q.defer();
        updateInvoiceStub.returns(updateInvoicePromise.promise);

        findInvoicePromise = Q.defer();
        findInvoiceStub.returns(findInvoicePromise.promise);
    });

    afterEach(() => {
        models.Invoice.create.restore();
        models.Invoice.update.restore();
        models.Invoice.findById.restore();
        newInvoiceloggerStub.restore();
        updateInvoiceloggerStub.restore();
        createEmptyInvoiceloggerStub.restore();
    });

    describe("create new invoice", () => {
        beforeEach(() => {
          expectedNewInvoice = {
            memberEmail: "sherlock@holmes.co.uk",
            totalAmountInCents: 6000,
            paymentDate: moment().format('L'),
            paymentType: "deposit",
            reference: "FUL1234",
            paymentStatus: "Pending"
          };
        });

        it ("given invoice not found.", (done) => {
            newInvoice.invoiceId = -1;
            findInvoicePromise.resolve();
            createInvoicePromise.resolve();

            invoiceService.createInvoice(newInvoice)
                .then(() => {
                    expect(Invoice.findById).toHaveBeenCalledWith(-1);
                    expect(Invoice.create).toHaveBeenCalledWith(expectedNewInvoice);
                    expect(Invoice.update).not.toHaveBeenCalled();
                }).nodeify(done);
        });

        it("logs the invoice creation event", (done) => {
          findInvoicePromise.resolve();
          createInvoicePromise.resolve(expectedNewInvoice);

          invoiceService.createInvoice(newInvoice)
              .finally(() => {
                  expect(logger.logNewInvoiceEvent).toHaveBeenCalledWith(expectedNewInvoice);
              })
              .nodeify(done);
        });
    });

    describe("update invoice", () => {
        let foundInvoice;

        beforeEach(() => {
          newInvoice.invoiceId = 1;
          expectedNewInvoice = {
            totalAmountInCents: 6000,
            paymentType: "deposit",
            paymentDate: moment().format('L'),
            paymentStatus: "Pending",
          };

          foundInvoice = {dataValues: newInvoice};
          foundInvoice.dataValues.id = 1;
        });

        it ("update the exisiting invoice", (done) => {
            findInvoicePromise.resolve(foundInvoice);
            updateInvoicePromise.resolve();

            invoiceService.createInvoice(newInvoice)
                .then(() => {
                    expect(Invoice.findById).toHaveBeenCalledWith(1);
                    expect(Invoice.update).toHaveBeenCalledWith(expectedNewInvoice, {where: {id: 1} });
                    expect(Invoice.create).not.toHaveBeenCalled();
                }).nodeify(done);
        });

        it ("update stripe reference with passed in values", (done) => {
            newInvoice.paymentStatus = "Paid";
            newInvoice.paymentType = "stripe";
            newInvoice.reference = "STRIPE_1234";

            expectedNewInvoice.paymentType = "stripe";
            expectedNewInvoice.reference = "STRIPE_1234";
            expectedNewInvoice.paymentStatus = "Paid";
            findInvoicePromise.resolve(foundInvoice);
            updateInvoicePromise.resolve();

            invoiceService.createInvoice(newInvoice)
                .then(() => {
                    expect(Invoice.findById).toHaveBeenCalledWith(1);
                    expect(Invoice.update).toHaveBeenCalledWith(expectedNewInvoice, {where: {id: 1} });
                    expect(Invoice.create).not.toHaveBeenCalled();
                }).nodeify(done);
        });

        it("logs update invoice event", (done) => {
          findInvoicePromise.resolve(foundInvoice);
          updateInvoicePromise.resolve();

          invoiceService.createInvoice(newInvoice)
              .finally(() => {
                  expect(logger.logUpdateInvoiceEvent).toHaveBeenCalledWith(1, expectedNewInvoice);
              }).nodeify(done);
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

    describe("create empty invoice", () => {
        beforeEach(() => {
            expectedNewInvoice = {
                memberEmail: memberEmail,
                totalAmountInCents: 0,
                paymentDate: moment().format('L'),
                paymentType: '',
                reference: reference,
                paymentStatus: ''
            };
        });

        it ("with member email and reference number", (done) => {
            createInvoicePromise.resolve();

            invoiceService.createEmptyInvoice(memberEmail, reference)
                .then(() => {
                    expect(Invoice.create).toHaveBeenCalledWith(expectedNewInvoice);
                }).nodeify(done);
        });

        it("logs the create new invoice event", (done) => {
            createInvoicePromise.resolve();

            invoiceService.createEmptyInvoice(memberEmail, reference)
                .finally(() => {
                    expect(logger.logCreateEmptyInvoiceEvent).toHaveBeenCalledWith(memberEmail, reference);
                }).nodeify(done);
        });
    });

    describe("an error when find invoice", () => {
        it("rejects the promise", (done) => {
            let errorMessage = "Seriously, we still don't have any damn bananas.";
            findInvoicePromise.reject(errorMessage);

            let promise = invoiceService.createInvoice(newInvoice);

            promise.finally(() => {
                expect(promise.isRejected()).toBe(true);
                done();
            });
        });
    });

    describe("an error when create invoice", () => {
        it("rejects the promise", (done) => {
            let errorMessage = "Seriously, we still don't have any damn bananas.";
            findInvoicePromise.resolve();
            createInvoicePromise.reject(errorMessage);

            let promise = invoiceService.createInvoice(newInvoice);

            promise.finally(() => {
                expect(promise.isRejected()).toBe(true);
                done();
            });
        });
    });

    describe("an error when update invoice", () => {
        it("rejects the promise", (done) => {
            let errorMessage = "Seriously, we still don't have any damn bananas.";
            findInvoicePromise.resolve(newInvoice);
            updateInvoicePromise.reject(errorMessage);

            let promise = invoiceService.createInvoice(newInvoice);

            promise.finally(() => {
                expect(promise.isRejected()).toBe(true);
                done();
            });
        });
    });

    describe("an error when create empty invoice", () => {
        it("rejects the promise", (done) => {
            let errorMessage = "Seriously, we still don't have any damn bananas.";
            createInvoicePromise.reject(errorMessage);

            let promise = invoiceService.createEmptyInvoice(memberEmail, reference);

            promise.finally(() => {
                expect(promise.isRejected()).toBe(true);
                done();
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

  describe('paypalChargeSuccess', () => {
      let updateLoggerStub, failedUpdateLoggerStub,
      invoiceStub, invoicePromise;

      beforeEach( () => {
          updateLoggerStub = sinon.stub(logger, 'logNewPaypalUpdate');
          failedUpdateLoggerStub = sinon.stub(logger, 'logNewFailedPaypalUpdate');
          invoiceStub = sinon.stub(models.Invoice, 'update');
          invoicePromise = Q.defer();
          invoiceStub.returns(invoicePromise.promise);
      });

      afterEach( () => {
          updateLoggerStub.restore();
          failedUpdateLoggerStub.restore();
          invoiceStub.restore();
      });

      it('should call the error logger when no matching invoice Id in database' , () => {
          invoicePromise.resolve([0]);

          let promise = invoiceService.paypalChargeSuccess(23, 1);

          promise.finally(() => {
              expect(updateLoggerStub).toHaveBeenCalled();
              expect(failedUpdateLoggerStub).toHaveBeenCalled();
          });
      });
    });
});
