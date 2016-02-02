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
        newInvoiceloggerStub, findInvoiceStub,
        updateInvoiceloggerStub, newInvoice,
        expectedInvoice, createInvoicePromise,
        updateInvoicePromise, findInvoicePromise,
        createEmptyInvoiceloggerStub, memberEmail, reference,
        createdEmptyInvoice, invoiceId, errorLoggerStub;

    beforeEach(() => {
        createInvoiceStub = sinon.stub(models.Invoice, 'create');
        updateInvoiceStub = sinon.stub(models.Invoice, 'update');
        findInvoiceStub = sinon.stub(models.Invoice, 'findOne');
        newInvoiceloggerStub = sinon.stub(logger, 'logNewInvoiceEvent');
        updateInvoiceloggerStub = sinon.stub(logger, 'logUpdateInvoiceEvent');
        createEmptyInvoiceloggerStub = sinon.stub(logger, 'logCreateEmptyInvoiceEvent');
        errorLoggerStub = sinon.stub(logger, 'logError');

        invoiceId = 1;

        newInvoice = {
            totalAmount: 60,
            paymentType: "deposit",
            paymentDate: moment().format('L'),
            paymentStatus: "Pending",
            invoiceId: invoiceId
        };

        expectedInvoice = {
            invoiceId: invoiceId,
            reference: 'FUL1'
        };

        createdEmptyInvoice = {dataValues: {id: 1}};

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
        models.Invoice.findOne.restore();
        newInvoiceloggerStub.restore();
        updateInvoiceloggerStub.restore();
        createEmptyInvoiceloggerStub.restore();
        errorLoggerStub.restore();
    });

    describe("create empty invoice", () => {
        let membershipType,
            updatedInovice, emptyInvoice;

        beforeEach(() => {
            emptyInvoice = {
                memberEmail: memberEmail,
                totalAmountInCents: 0,
                paymentDate: moment().format('L'),
                paymentType: '',
                reference: ''
            };

            membershipType = "full";
            updatedInovice = {dataValues: expectedInvoice};
        });

        it ("with member email and membershipType, then update the reference", (done) => {
            createInvoicePromise.resolve(createdEmptyInvoice);
            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.resolve(updatedInovice);

            invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .then((createdInvoice) => {
                    expect(createdInvoice.dataValues.id).toEqual(expectedInvoice.id);
                }).nodeify(done);
        });

        it("logs the create empty invoice event", (done) => {
            createInvoicePromise.resolve(createdEmptyInvoice);
            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.resolve(updatedInovice);

            invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .finally(() => {
                    expect(logger.logCreateEmptyInvoiceEvent).toHaveBeenCalledWith(createdEmptyInvoice);
                    expect(logger.logUpdateInvoiceEvent).toHaveBeenCalledWith(1, {reference: 'FUL1'});
                }).nodeify(done);
        });

        it("logs the error when create empty invoice failed", (done) => {
            createInvoicePromise.resolve(createdEmptyInvoice);
            findInvoicePromise.resolve({});

            let promise = invoiceService.createEmptyInvoice(memberEmail, membershipType);

            promise.catch((error) => {
                expect(logger.logError).toHaveBeenCalled();
                expect(error.message).toEqual('An error has occurred internally.');
            }).nodeify(done);
        });

        describe('reject the promise when', () => {
            it("create empty invoice failed", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                createInvoicePromise.reject(errorMessage);

                let promise = invoiceService.createEmptyInvoice(memberEmail, membershipType);

                promise.finally(() => {
                    expect(promise.isRejected()).toBe(true);
                }).nodeify(done);
            });

            it("find invoice failed", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                createInvoicePromise.resolve(createdEmptyInvoice);
                findInvoicePromise.reject(errorMessage);

                let promise = invoiceService.createEmptyInvoice(memberEmail, membershipType);

                promise.finally(() => {
                    expect(promise.isRejected()).toBe(true);
                }).nodeify(done);
            });

            it("invoice not found", (done) => {
                createInvoicePromise.resolve(createdEmptyInvoice);
                findInvoicePromise.resolve({});

                let promise = invoiceService.createEmptyInvoice(memberEmail, membershipType);

                promise.finally(() => {
                    expect(promise.isRejected()).toBe(true);
                }).nodeify(done);
            });

            it("update invoice failed", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                createInvoicePromise.resolve(createdEmptyInvoice);
                findInvoicePromise.resolve(invoiceId);
                updateInvoicePromise.reject(errorMessage);

                let promise = invoiceService.createEmptyInvoice(memberEmail, membershipType);

                promise.finally(() => {
                    expect(promise.isRejected()).toBe(true);
                }).nodeify(done);
            });
        });
    });

    describe("pay for invoice", () => {
        describe("Credit Card/Debit Card Payment", () => {
            let stripeHandlerStub, stripeChargePromise,
            stripeToken, totalAmount,
            loggerStub, failedLoggerStub;

            beforeEach(() => {
                newInvoice.paymentType = 'stripe';
                newInvoice.paymentStatus = 'PAID';
                newInvoice.transactionId = 'trans_1';
                newInvoice.stripeToken = 'token';

                stripeToken="47";
                totalAmount = 123;

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
                findInvoicePromise.resolve(createdEmptyInvoice);
                updateInvoicePromise.resolve({dataValues: expectedInvoice});

                invoiceService.payForInvoice(newInvoice)
                    .finally(() => {
                        expect(stripeHandler.chargeCard).toHaveBeenCalledWith(newInvoice.stripeToken, newInvoice.totalAmount);
                        done();
                    });
            });

            it("After charge, logger should log", (done) => {
                stripeChargePromise.resolve();
                findInvoicePromise.resolve(createdEmptyInvoice);
                updateInvoicePromise.resolve({dataValues: expectedInvoice});

                let promise = invoiceService.payForInvoice(newInvoice);

                promise.finally(() => {
                    expect(logger.logNewChargeEvent).toHaveBeenCalledWith(newInvoice.stripeToken);
                    expect(logger.logNewFailedCharge).not.toHaveBeenCalled();
                    done();
                });
            });

            it ("update stripe reference with passed in values", (done) => {
                let invoice = {
                    totalAmountInCents: 6000,
                    paymentDate: moment().format('L'),
                    paymentType: 'stripe',
                    paymentStatus: 'PAID',
                    transactionId: 'trans_1'
                };

                stripeChargePromise.resolve({id:'trans_1'});
                findInvoicePromise.resolve(createdEmptyInvoice);
                updateInvoicePromise.resolve({dataValues: expectedInvoice});

                invoiceService.payForInvoice(newInvoice)
                    .then((updatedInvoice) => {
                        expect(updatedInvoice.dataValues.id).toEqual(expectedInvoice.id);
                        expect(updatedInvoice.dataValues.reference).toEqual(expectedInvoice.reference);

                        expect(Invoice.update).toHaveBeenCalledWith(invoice, {where: {id: 1}});
                    }).nodeify(done);
            });

            it("If charge card fails, logger should log failed event", (done) => {
                let errorMessage = "Charge card failed with Stripe!";
                stripeChargePromise.reject(errorMessage);

                let promise = invoiceService.payForInvoice(newInvoice);

                promise.finally(() => {
                    expect(promise.isRejected()).toBe(true);
                    expect(logger.logNewFailedCharge).toHaveBeenCalledWith(newInvoice.stripeToken, errorMessage);
                    done();
                });
            });

            it("If charge card fails, should reject promise with charg card error", (done) => {
                let errorMessage = "Charge card failed with Stripe!";
                stripeChargePromise.reject(errorMessage);

                let promise = invoiceService.payForInvoice(newInvoice);

                promise.catch((error) => {
                    expect(error.name).toEqual('ChargeCardError');
                    expect(error.message).toEqual('Failed to charge card!');
                    done();
                });
            });
        });

        describe("Direct debit, cheque, and no contribute payment", () => {
            it ("update the exisiting invoice", (done) => {
                let invoice = {
                    totalAmountInCents: 6000,
                    paymentDate: moment().format('L'),
                    paymentType: 'deposit',
                    paymentStatus: 'Pending'
                };

                findInvoicePromise.resolve(createdEmptyInvoice);
                updateInvoicePromise.resolve({dataValues: expectedInvoice});

                invoiceService.payForInvoice(newInvoice)
                    .then((updatedInvoice) => {
                        expect(updatedInvoice.dataValues.id).toEqual(expectedInvoice.id);
                        expect(updatedInvoice.dataValues.reference).toEqual(expectedInvoice.reference);

                        expect(Invoice.update).toHaveBeenCalledWith(invoice, {where: {id: 1}});
                    }).nodeify(done);
            });
        });

        it("logs update invoice event", (done) => {
            let invoice = {
                totalAmountInCents: 6000,
                paymentDate: moment().format('L'),
                paymentType: 'deposit',
                paymentStatus: 'Pending'
            };

            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.resolve({dataValues: expectedInvoice});

            invoiceService.payForInvoice(newInvoice)
                .finally(() => {
                    expect(logger.logUpdateInvoiceEvent).toHaveBeenCalledWith(1, invoice);
                }).nodeify(done);
        });

        it("rejects the promise when update invoice failed, and log the error", (done) => {
            let errorMessage = "Seriously, we still don't have any damn bananas.";
            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.reject(errorMessage);

            let promise =  invoiceService.payForInvoice(newInvoice);

            promise.catch((error) => {
                expect(error).toEqual(errorMessage);
                expect(promise.isRejected()).toBe(true);
            }).nodeify(done);
        });

        it("rejects the promise when find invoice failed, and log the error", (done) => {
            findInvoicePromise.resolve({});

            let promise =  invoiceService.payForInvoice(newInvoice);

            promise.catch((error) => {
                expect(error.message).toEqual('Invoice not found for Id: 1');
                expect(promise.isRejected()).toBe(true);
            }).nodeify(done);
        });
    });

    describe('paypalChargeSuccess', () => {
        let updateLoggerStub, failedUpdateLoggerStub;

        beforeEach( () => {
            updateLoggerStub = sinon.stub(logger, 'logNewPaypalUpdate');
            failedUpdateLoggerStub = sinon.stub(logger, 'logNewFailedPaypalUpdate');
        });

        afterEach( () => {
            updateLoggerStub.restore();
            failedUpdateLoggerStub.restore();
        });

        it('should not call the error logger when finds matching invoice in db' , (done) => {
            updateInvoicePromise.resolve([1]);

            let promise = invoiceService.paypalChargeSuccess(23, 1);

            promise.finally(() => {
                expect(updateLoggerStub).toHaveBeenCalled();
                expect(failedUpdateLoggerStub).not.toHaveBeenCalled();
                expect(promise.isResolved()).toBe(true);
            }).nodeify(done);
        });

        it('should call the error logger when no matching invoice id in database' , (done) => {
            updateInvoicePromise.resolve([0]);

            let promise = invoiceService.paypalChargeSuccess(23, 1);

            promise.finally(() => {
                expect(updateLoggerStub).toHaveBeenCalled();
                expect(failedUpdateLoggerStub).toHaveBeenCalled();
                expect(promise.isRejected()).toBe(true);
            }).nodeify(done);
        });

        it('should call the error logger when no multiple matching invoice id in database' , (done) => {
            updateInvoicePromise.resolve([2]);

            let promise = invoiceService.paypalChargeSuccess(23, 1);

            promise.finally(() => {
                expect(updateLoggerStub).toHaveBeenCalled();
                expect(failedUpdateLoggerStub).toHaveBeenCalled();
                expect(promise.isRejected()).toBe(true);
            }).nodeify(done);
        });
      });
});




