'use strict';

const moment = require('moment');
require('../../../support/specHelper');

var memberValidator = require('../../../../src/backend/lib/inputValidator');

describe('inputValidator', () => {
    describe('isValidName', () => {
        it('Should return true given an alpha name', () => {
            expect(memberValidator.isValidName('aaa')).toBe(true);
        });

        it('Should return true if name is a alphanumeric', () => {
            expect(memberValidator.isValidName('Flo the 1st')).toBe(true);
        });

        [
            undefined,
            '',
            null,
            'a'.repeat(256),
            'Flo the 1st<'
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(memberValidator.isValidName(testCase)).toBe(false);
            });
        });
    });

    describe('isValidEmail', () => {
        it('Should return true given a string with an \'@\' and a \'.\'', () => {
            expect(memberValidator.isValidEmail('aaa@attt.com')).toBe(true);
        });
    });

    describe('isValidPhoneNumber', () => {
        [
            '+61472817381',
            '0328171381',
            '0428171331',
            '04-2817-133-1',
            '04 2817 1331',
            '+1555-555-5555',
            '+1(555)555-5555',
            '+65 2345 7908',
            '+18-1111-1111111'
        ].forEach((testCase) => {
            it(`Should return true given a string with a mobile phone number ${testCase}`, () => {
                expect(memberValidator.isValidPhone(testCase)).toBe(true);
            });
        });

        [
            '',
            '-;',
            ' 0 0 1;',
            null,
            'words?'
        ].forEach((testCase) => {
            it(`Should return false if phone is ${testCase}`, () => {
                expect(memberValidator.isValidPhone(testCase)).toBe(false);
            });
        });
    });

    describe('isValidDateOfBirth', () => {
        it('Should return true given a string with a dateOfBirth', () => {
            expect(memberValidator.isValidDate('22/12/1900')).toBe(true);
        });

        let testCases = [
            null,
            '',
            '21 Dec 2015',
            moment().add(7, 'days'),
            '222/12/1900'
        ];

        testCases.forEach((input) => {
            it(`Should return false given a ${input} dateOfBirth`, () => {
                expect(memberValidator.isValidDate(input)).toBe(false);
            });
        });
    });

    describe('isValidOptionalName', () => {
        let validTestCases = [
            null,
            '',
            undefined,
            'A valid name'
        ];

        validTestCases.forEach((input) => {
            it(`should return true if given a ${input} value`, () => {
                expect(memberValidator.isValidOptionalName(input)).toBe(true);
            });
        });

        let testCases = [
            'a'.repeat(256),
            'Flo the 1st<'
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(memberValidator.isValidOptionalName(input)).toBe(false);
            });
        });
    });

    describe('isValidOptionalTextBlock', () => {

        let validTestCases = [
            null,
            '',
            undefined,
            'A valid text block',
            'Flo the 1st<',
            'a'.repeat(257)
        ];

        validTestCases.forEach((input) => {
            it(`should return true if given a ${input} value`, () => {
                expect(memberValidator.isValidOptionalTextBlock(input)).toBe(true);
            });
        });

        let testCases = [
            'a'.repeat(2000)
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(memberValidator.isValidOptionalTextBlock(input)).toBe(false);
            });
        });
    });

    describe('isValidUUID', () => {

        it('should return true for V4 uuids', () => {
            expect(memberValidator.isValidUUID('5d773d92-47fb-4ad5-90c0-72c1b6e4af3a')).toBe(true);
        });

        it('should return false for non V4 uuids', () => {
            expect(memberValidator.isValidUUID('4df38c00-e65a-11e5-a8bf-ed9212c0336b')).toBe(false);
        });


        let testCases = [
            'a'.repeat(20),
            null,
            undefined,
            1
        ];

        testCases.forEach((input) => {
            it(`should return false if given a ${input} value`, () => {
                expect(memberValidator.isValidUUID(input)).toBe(false);
            });
        });
    });
});
