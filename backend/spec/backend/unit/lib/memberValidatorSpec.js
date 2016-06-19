'use strict';

require('../../../support/specHelper');

var memberValidator = require('../../../../src/lib/memberValidator');

describe('memberValidator', () => {
    describe('isValid', () => {

      let validMember = {
        'contactFirstName': 'Jaime',
        'branchId': 'rururu-we-ew-ew',
        'firstName': 'Sherlock',
        'email': 'sherlock@holmes.co.uk',
        'dateOfBirth': '01/01/1983',
        'primaryPhoneNumber': '+263-64-8581786',
        'gender': 'horse radish',
      };

      let optionalFields = {
          'contactLastName': 'Sherlock',
          'lastName': 'Holmes',
          'additionalInfo':  'More info for you!',
          'pastoralNotes': 'Some extra detail'
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
            'branchId': '',
        };
        let expectedErrors = ['contactFirstName','email','primaryPhoneNumber','firstName','dateOfBirth', 'branchId'];
          expect(memberValidator.isValid(invalidMember)).toEqual(expectedErrors);

      });
    });

});
