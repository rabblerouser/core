'use strict';

const moment = require('moment');
require('../../../support/specHelper');

var memberValidator = require('../../../../src/backend/lib/memberValidator');

describe('memberValidator', () => {
    describe('isValid', () => {

      let validMember = {
        'contactFirstName': 'Jaime',
        'schoolType': 'Primary',
        'branch': 'rururu-we-ew-ew',
        'firstName': 'Sherlock',
        'email': 'sherlock@holmes.co.uk',
        'dateOfBirth': '01/01/1983',
        'primaryPhoneNumber': '+263-64-8581786',
        'gender': 'horse radish',
      };

      let optionalFields = {
          'contactLastName': 'Sherlock',
          'lastName': 'Holmes',
          'additionalInfo':  'More info for you!'
      };

      let validMemberWithOptionalFields = Object.assign({}, validMember, optionalFields);

      it('should return empty array of errors on valid member', () => {
          expect(memberValidator.isValid(validMember)).toEqual([]);
      });

      it('should return empty array of errors on valid member with optional fields', () => {
          expect(memberValidator.isValid(validMemberWithOptionalFields)).toEqual([]);
      });

      it('should return array of errors on null member', () => {
          expect(memberValidator.isValid(null).length).not.toBe(0);
      });

      it('should return array of errors when missing data', () => {
        let invalidMember = {
            'contactFirstName': '',
            'email': '',
            'primaryPhoneNumber': '',
            'firstName': '',
            'dateOfBirth':  '',
            'branch': '',
            'schoolType': ''
        };
        let expectedErrors = ['contactFirstName','email','primaryPhoneNumber','firstName','dateOfBirth', 'branch','schoolType'];
          expect(memberValidator.isValid(invalidMember)).toEqual(expectedErrors);

      });

    });

    describe('isValidName', () => {
        it('Should return true given an alpha name', () => {
            expect(memberValidator.isValidName('aaa')).toBe(true);
        });

        it('Should return true if name is a alphanumeric', () => {
            expect(memberValidator.isValidName('Flo the 1st')).toBe(true);
        });

        [
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
});
