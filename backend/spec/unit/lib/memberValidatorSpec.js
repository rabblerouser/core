'use strict';

const memberValidator = require('../../../src/lib/memberValidator');

describe('memberValidator', () => {
  describe('isValid', () => {
    const validMember = {
      branchId: 'rururu-we-ew-ew',
      name: 'Sherlock Holmes',
      email: 'sherlock@holmes.co.uk',
    };

    const optionalFields = {
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
        branchId: '',
      };
      const expectedErrors = ['email', 'name', 'branchId'];
      expect(memberValidator.isValid(invalidMember)).to.have.members(expectedErrors);
    });
  });
});
