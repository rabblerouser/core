'use strict';

var memberValidator = require('../../../src/lib/memberValidator');

describe('memberValidator', () => {
    describe('isValid', () => {

      let validMember = {
        'branchId': 'rururu-we-ew-ew',
        'firstName': 'Sherlock',
        'email': 'sherlock@holmes.co.uk',
        'gender': 'horse radish',
      };

      let optionalFields = {
          'lastName': 'Holmes',
          'additionalInfo':  'More info for you!',
          'primaryPhoneNumber': '+263-64-8581786',
          'notes': 'Some extra detail'
      };

      let validMemberWithOptionalFields = Object.assign({}, validMember, optionalFields);

      it('should return empty array of errors on valid member', () => {
        expect(memberValidator.isValid(validMember)).to.be.instanceof(Array);
          expect(memberValidator.isValid(validMember)).to.be.empty;
      });

      it('should return empty array of errors on valid member with optional fields', () => {
        expect(memberValidator.isValid(validMemberWithOptionalFields)).to.be.instanceof(Array);
          expect(memberValidator.isValid(validMemberWithOptionalFields)).to.be.empty;
      });

      it('should return array of errors on null member', () => {
          expect(memberValidator.isValid(null).length).to.not.equal(0);
      });

      it('should return array of errors when missing data', () => {
        let invalidMember = {
            'email': '',
            'primaryPhoneNumber': '',
            'firstName': '',
            'branchId': '',
        };
        let expectedErrors = ['email', 'firstName', 'branchId'];
          expect(memberValidator.isValid(invalidMember)).to.have.members(expectedErrors);

      });
    });

});
