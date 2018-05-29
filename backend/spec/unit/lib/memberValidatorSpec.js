'use strict';

// Prevents warnings from Chai's `expect()….to.be.true` and similar
/* eslint no-unused-expressions: "off" */

const memberValidator = require('../../../src/lib/memberValidator');

describe('memberValidator', () => {
  describe('isValid', () => {
    const validMember = {
      name: 'Sherlock Holmes',
      email: 'sherlock@holmes.co.uk',
    };

    const optionalFields = {
      branchId: 'rururu-we-ew-ew',
      additionalInfo: 'More info for you!',
      phoneNumber: '+263-64-8581786',
      notes: 'Some extra detail',
    };

    const validMemberWithOptionalFields = Object.assign({}, validMember, optionalFields);

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
      const invalidMember = {
        email: '',
        phoneNumber: '',
        name: '',
      };
      const expectedErrors = ['email', 'name'];
      expect(memberValidator.isValid(invalidMember)).to.have.members(expectedErrors);
    });
  });
});
