'use strict';

const specHelper = require('../../support/specHelper'),
    stripeHandler = require('../../../lib/stripeHandler'),
    models = specHelper.models,
    Invoice = models.Invoice,
    sinon = specHelper.sinon,
    Q = specHelper.Q,
    logger = specHelper.logger,
    moment = require('moment');

var invoiceService = require('../../../services/invoiceService');

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
            paymentType: 'deposit',
            paymentDate: moment().format('L'),
            paymentStatus: 'Pending',
            invoiceId: invoiceId
        };

        expectedInvoice = {
            invoiceId: invoiceId,
            reference: 'FUL1'
        };

        createdEmptyInvoice = {dataValues: {id: 1}};

        memberEmail = 'sherlock@holmes.co.uk';
        reference = 'FUL1234';

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

    describe('create empty invoice', () => {
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

            membershipType = 'full';
            updatedInovice = {dataValues: expectedInvoice};
        });

        it ('with member email and membershipType, then update the reference', (done) => {
            createInvoicePromise.resolve(createdEmptyInvoice);
            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.resolve(updatedInovice);

            invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .then((createdInvoice) => {
                    expect(createdInvoice.id).toEqual(expectedInvoice.invoiceId);
                }).then(done, done.fail);
        });

        it('logs the create empty invoice event', (done) => {
            createInvoicePromise.resolve(createdEmptyInvoice);
            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.resolve(updatedInovice);

            invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .finally(() => {
                    expect(logger.logCreateEmptyInvoiceEvent).toHaveBeenCalledWith(createdEmptyInvoice);
                    expect(logger.logUpdateInvoiceEvent).toHaveBeenCalledWith(1, {reference: 'FUL1'});
                }).then(done, done.fail);
        });

        it('logs the error when create empty invoice failed', (done) => {
            createInvoicePromise.resolve(createdEmptyInvoice);
            findInvoicePromise.resolve({});

            let promise = invoiceService.createEmptyInvoice(memberEmail, membershipType);

            promise.catch((error) => {
                expect(logger.logError).toHaveBeenCalled();
                expect(error.message).toEqual('An error has occurred internally.');
            }).then(done, done.fail);
        });

        describe('reject the promise when', () => {
            it('create empty invoice failed', (done) => {
                createInvoicePromise.reject('Seriously, we still don\'t have any damn bananas.');

                invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .then(() => {
                    done.fail('createEmptyInvoice should have failed, not succeeded, not this time.');
                })
                .catch((error) => {
                    expect(error).not.toBeNull();
                    done();
                });
            });

            it('find invoice failed', (done) => {
                createInvoicePromise.resolve(createdEmptyInvoice);
                findInvoicePromise.reject('Seriously, we still don\'t have any damn bananas.');

                invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .then(() => {
                    done.fail('createEmptyInvoice should have failed, not succeeded, not this time.');
                })
                .catch((error) => {
                    expect(error).not.toBeNull();
                    done();
                });
            });

            it('invoice not found', (done) => {
                createInvoicePromise.resolve(createdEmptyInvoice);
                findInvoicePromise.resolve({});

                invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .then(() => {
                    done.fail('createEmptyInvoice should have failed, not succeeded, not this time.');
                })
                .catch((error) => {
                    expect(error).not.toBeNull();
                    done();
                });
            });

            it('update invoice failed', (done) => {
                let errorMessage = 'Seriously, we still don\'t have any damn bananas.';
                createInvoicePromise.resolve(createdEmptyInvoice);
                findInvoicePromise.resolve(invoiceId);
                updateInvoicePromise.reject(errorMessage);

                invoiceService.createEmptyInvoice(memberEmail, membershipType)
                .then(() => {
                    done.fail('createEmptyInvoice should have failed, not succeeded, not this time.');
                })
                .catch((error) => {
                    expect(error).not.toBeNull();
                    done();
                });
            });
        });
    });

    describe('pay for invoice', () => {
        describe('Credit Card/Debit Card Payment', () => {
            let stripeHandlerStub, stripeChargePromise,
            stripeToken, totalAmount,
            loggerStub, failedLoggerStub;

            beforeEach(() => {
                newInvoice.paymentType = 'stripe';
                newInvoice.paymentStatus = 'PAID';
                newInvoice.transactionId = 'trans_1';
                newInvoice.stripeToken = 'token';

                stripeToken='47';
                totalAmount = 123;

                stripeHandlerStub = sinon.stub(stripeHandler, 'chargeCard');
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

            it('should call charge card handler to charge the card', (done) => {
                stripeChargePromise.resolve();
                findInvoicePromise.resolve(createdEmptyInvoice);
                updateInvoicePromise.resolve({dataValues: expectedInvoice});

                invoiceService.payForInvoice(newInvoice)
                    .finally(() => {
                        expect(stripeHandler.chargeCard).toHaveBeenCalledWith(newInvoice.stripeToken, newInvoice.totalAmount);
                        done();
                    });
            });

            it('After charge, logger should log', (done) => {
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

            it('update stripe reference with passed in values', (done) => {
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
                    }).then(done, done.fail);
            });

            it('If charge card fails, logger should log failed event', (done) => {
                let errorMessage = 'Charge card failed with Stripe!';
                stripeChargePromise.reject(errorMessage);

                invoiceService.payForInvoice(newInvoice)
                .then(() => {
                    done.fail('payForInvoice should have failed, not succeeded, not this time.');
                })
                .catch((error) => {
                    expect(error).not.toBeNull();
                    expect(logger.logNewFailedCharge).toHaveBeenCalledWith(newInvoice.stripeToken, errorMessage);
                }).then(done, done.fail);
            });

            it('If charge card fails, should reject promise with charg card error', (done) => {
                stripeChargePromise.reject('Charge card failed with Stripe!');

                invoiceService.payForInvoice(newInvoice)
                .then(() => {
                    done.fail('payForInvoice should have failed, not succeeded, not this time.');
                })
                .catch((error) => {
                    expect(error.name).toEqual('ChargeCardError');
                    expect(error.message).toEqual('Failed to charge card!');
                }).then(done, done.fail);
            });
        });

        describe('Direct debit, cheque, and no contribute payment', () => {
            it('update the exisiting invoice', (done) => {
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
                    }).then(done, done.fail);
            });
        });

        it('logs update invoice event', (done) => {
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
                }).then(done, done.fail);
        });

        it('rejects the promise when update invoice failed, and log the error', (done) => {
            let errorMessage = 'Seriously, we still don\'t have any damn bananas.';
            findInvoicePromise.resolve(createdEmptyInvoice);
            updateInvoicePromise.reject(errorMessage);

            invoiceService.payForInvoice(newInvoice)
            .then(() => {
                done.fail('payForInvoice should have failed, not succeeded, not this time.');
            })
            .catch((error) => {
                expect(error).toEqual(errorMessage);
            }).then(done, done.fail);
        });

        it('rejects the promise when find invoice failed, and log the error', (done) => {
            findInvoicePromise.resolve({});

            invoiceService.payForInvoice(newInvoice)
            .then(() => {
                done.fail('payForInvoice should have failed, not succeeded, not this time.');
            })
            .catch((error) => {
                expect(error.message).toEqual('Invoice not found for Id: 1');
            }).then(done, done.fail);
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
            }).then(done, done.fail);
        });

        it('should call the error logger when no matching invoice id in database' , (done) => {
            updateInvoicePromise.resolve([0]);

            invoiceService.paypalChargeSuccess(23, 1)
            .then(() => {
                done.fail('paypalChargeSuccess should have failed, not succeeded, not this time.');
            })
            .catch((error) => {
                expect(updateLoggerStub).toHaveBeenCalled();
                expect(failedUpdateLoggerStub).toHaveBeenCalled();
                expect(error).not.toBeNull();
            }).then(done, done.fail);

        });

        it('should call the error logger when no multiple matching invoice id in database' , (done) => {
            updateInvoicePromise.resolve([2]);

            invoiceService.paypalChargeSuccess(23, 1)
            .then(() => {
                done.fail('paypalChargeSuccess should have failed, not succeeded, not this time.');
            })
            .catch((error) => {
                expect(updateLoggerStub).toHaveBeenCalled();
                expect(failedUpdateLoggerStub).toHaveBeenCalled();
                expect(error).not.toBeNull();
            }).then(done, done.fail);
        });
      });

    describe('unconfirmedPaymentList', () => {
        let invoiceFindAllStub, findAllPromise, unconfirmedPaymentValue, expectedOutput;

        beforeEach(() => {
            invoiceFindAllStub = sinon.stub(models.Invoice, 'findAll');
            findAllPromise = Q.defer();
            invoiceFindAllStub.returns(findAllPromise.promise);
            unconfirmedPaymentValue = [
                {
                    dataValues: {
                        reference: 'INT34',
                        paymentType: 'deposit',
                        totalAmountInCents: '2000',
                        paymentStatus: 'Pending',
                        member: {
                            dataValues: {
                                firstName: 'Gotta catch em all',
                                lastName: 'Pokemans Pokewomans Pokepeople'
                            }
                        }
                    }
                }];
            expectedOutput = [{
                firstName: 'Gotta catch em all',
                lastName: 'Pokemans Pokewomans Pokepeople',
                reference: 'INT34',
                paymentType: 'deposit',
                totalAmountInCents: '2000',
                paymentStatus: 'Pending'
            }];
        });

        afterEach(() => {
            invoiceFindAllStub.restore();
        });

        it('Should retrieve the unconfirmed payments', (done) => {
            findAllPromise.resolve(unconfirmedPaymentValue);

            let promise = invoiceService.unconfirmedPaymentList();

            promise.then((value) => {
                expect(invoiceFindAllStub).toHaveBeenCalled();
                expect(value).toEqual(expectedOutput);
            }).then(done, done.fail)
                .catch(done.fail);
        });

        it('Should throw an error if findAll fails', (done) => {
            findAllPromise.reject('Could not connect to database');

            let promise = invoiceService.unconfirmedPaymentList();

            promise.then(() => {
                done.fail('Should not go into then');
            }).catch((err) => {
                expect(err).toEqual('An error has occurred while fetching unconfirmed members');
                done();
            });
        });
    });

    describe('acceptPayment', () => {
        let reference ='INT8';

        it('Should retrieve the unconfirmed payments', (done) => {
            updateInvoicePromise.resolve([1]);

            let promise = invoiceService.acceptPayment(reference);

            promise.then(() => {
                expect(updateInvoiceStub).toHaveBeenCalled();
            }).then(done, done.fail)
                .catch(done.fail);
        });

        it('Should throw an error if update fails', (done) => {
            updateInvoicePromise.reject('This should not be shown to user');

            let promise = invoiceService.acceptPayment(reference);

            promise.then(() => {
                done.fail('Should not go into then');
            }).catch((err) => {
                expect(err).toEqual('This should not be shown to user');
                done();
            });
        });

        it('Should throw an error if no rows updated', (done) => {
            updateInvoicePromise.resolve([0]);

            let promise = invoiceService.acceptPayment(reference);

            promise.then(() => {
                done.fail('Should not go into then');
            }).catch((err) => {
                expect(err).toEqual('Failed to accept INT8 in the database');
                done();
            });
        });
    });
});
