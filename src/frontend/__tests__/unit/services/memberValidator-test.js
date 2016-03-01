'use strict';

const moment = require('moment');
import memberValidator from '../../../services/memberValidator';

describe('memberValidator', () => {
    describe('isValid', () => {

      let validMember = {
          'contactName': 'Sherlock',
          'contactEmail': 'sherlock@holmes.co.uk',
          'contactNumber': '0396291146',
          'participantName': 'Holmes',
          'participantBirthYear':  '2000',
          'labSelection': 'Geelong',
          'schoolType': 'Primary',
          'contactLastName': 'Sherlock',
          'participantLastName': 'Holmes',
          'additionalInfo':  'More info for you!'
      };

      let validMemberWithOptional = {
        'contactName': 'Sherlock',
        'contactEmail': 'sherlock@holmes.co.uk',
        'contactNumber': '0396291146',
        'participantName': 'Holmes',
        'participantBirthYear':  '2000',
        'labSelection': 'Geelong',
        'schoolType': 'Primary',
        'contactLastName': '',
        'participantLastName': '',
        'additionalInfo':  ''
      };

      it('should return empty array of errors on valid member', () => {
          expect(memberValidator.isValid(validMember)).toEqual([]);
      });

      it('should return empty array of errors on valid member with optional fields', () => {
          expect(memberValidator.isValid(validMemberWithOptional)).toEqual([]);
      });

      it('should return array of errors on null member', () => {
          expect(memberValidator.isValid(null).length).not.toBe(0);
      });

      it('should return array of errors when missing data', () => {
        let invalidMember = {
            'contactName': '',
            'contactEmail': '',
            'contactNumber': '',
            'participantName': '',
            'participantBirthYear':  '',
            'labSelection': '',
            'schoolType': '',
            'contactLastName': '',
            'participantLastName': '',
            'additionalInfo':  ''
        };
        let expectedErrors = ['contactName','contactEmail','contactNumber','participantName','participantBirthYear', 'labSelection','schoolType'];
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
            Array(257).join('a'),
            'Flo the 1st<'
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(memberValidator.isValidName(testCase)).toBe(false);
            });
        });
    });

    describe('isValidOptionalName', () => {
      it('Should not be valid if it is undefined', () => {
        expect(memberValidator.isValidOptionalName()).toBe(false);
      });

      it('Should be valid if it is an empty string', () => {
        expect(memberValidator.isValidOptionalName('')).toBe(true);
      });

    });

    describe('isValidOptionalTextBlock', () => {
      it('Should not be valid if it is undefined', () => {
        expect(memberValidator.isValidOptionalTextBlock()).toBe(false);
      });

      it('Should be valid if it is an empty string', () => {
        expect(memberValidator.isValidOptionalTextBlock('')).toBe(true);
      });

      it('Should be valid if it is a big string', () => {
        expect(memberValidator.isValidOptionalTextBlock(Array(2000).join('a'))).toBe(true);
      });
    });

    describe('isValidEmail', () => {
        it('Should return true given a string with an \'@\' and a \'.\'', () => {
            expect(memberValidator.isValidEmail('aaa@attt.com')).toBe(true);
        });
    });

    describe('isValidYear', () => {
      [
          '2000',
          '2016',
          '1999'
      ].forEach((testCase) => {
          it(`Should return true given a string with a birth year in range ${testCase}`, () => {
              expect(memberValidator.isValidYear(testCase)).toBe(true);
          });
      });

      [
          '',
          '1899',
          null,
          '2017',
          'words?'
      ].forEach((testCase) => {
          it(`Should return false given a non year string or out of range ${testCase}`, () => {
              expect(memberValidator.isValidYear(testCase)).toBe(false);
          });
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
});
