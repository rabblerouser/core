'use strict';

require('../../support/specHelper');

var paymentValidator = require('../../../lib/paymentValidator');

describe('paymentValidator', () => {
    describe('isValid', () => {
        let validPayment = {
                'totalAmount': '100',
                'paymentType': 'cheque',
                'invoiceId': '1'
        };

        it('should return empty array of errors on valid payment', () => {
            expect(paymentValidator.isValid(validPayment)).toEqual([]);
        });

        it('should return array of errors on null payment', () => {
            expect(paymentValidator.isValid(null).length).not.toBe(0);
        });
    });

    describe('isValidAmount', () => {
        it('Should return true given a numberic amount string', () => {
            expect(paymentValidator.isValidAmount('123.2')).toBe(true);
        });

        it('Should return true given a postive numberic no less than 1', () => {
            expect(paymentValidator.isValidAmount(2)).toBe(true);
        });

        [
            '',
            '-1',
            0.1,
            -1,
            'abc',
            ''
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(paymentValidator.isValidAmount(testCase)).toBe(false);
            });
        });
    });

    describe('isValidPaymentType', () => {
        it('Should return true given a normal string', () => {
            expect(paymentValidator.isValidPaymentType('deposit')).toBe(true);
        });

        [
            '',
            null
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(paymentValidator.isValidPaymentType(testCase)).toBe(false);
            });
        });
    });

    describe('isValidId', () => {
        it('Should return true given a numberic id', () => {
            expect(paymentValidator.isValidId('1')).toBe(true);
            expect(paymentValidator.isValidId(1)).toBe(true);
        });

        [
            '',
            null,
            'string'
        ].forEach((testCase) => {
            it(`Should return false if id is ${testCase}`, () => {
                expect(paymentValidator.isValidId(testCase)).toBe(false);
            });
        });
    });

    describe('isValidNoContribute', () => {
        let validPayment = {
                'totalAmount': 0,
                'paymentType': 'noContribute',
                'invoiceId': '1'
        };

        it('should return empty array of errors on valid payment', () => {
            expect(paymentValidator.isValidNoContribute(validPayment)).toEqual([]);
        });

        it('should return array of errors on null payment', () => {
            expect(paymentValidator.isValidNoContribute(null).length).not.toBe(0);
        });
    });

});
