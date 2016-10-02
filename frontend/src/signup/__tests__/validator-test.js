import validator from '../validator';

describe('validator', () => {
  describe('isValid', () => {
    const validMember = {
      email: 'sherlock@holmes.co.uk',
      firstName: 'Holmes',
      branchId: 'Geelong',
      lastName: 'Holmes',
      additionalInfo: 'More info for you!',
    };

    const validMemberWithOptional = {
      email: 'sherlock@holmes.co.uk',
      primaryPhoneNumber: '0396291146',
      firstName: 'Holmes',
      branchId: 'Geelong',
      lastName: '',
      additionalInfo: '',
    };

    it('should return empty errors on valid member', () => {
      expect(validator(validMember)).toEqual({});
    });

    it('should return empty errors on valid member with optional fields', () => {
      expect(validator(validMemberWithOptional)).toEqual({});
    });

    it('should return array of errors when missing data', () => {
      const invalidMember = {
        email: '',
        primaryPhoneNumber: '',
        firstName: '',
        branchId: '',
        lastName: '',
      };
      const expectedErrors = [
        'branchId',
        'email',
        'firstName',
      ];
      expect(Object.keys(validator(invalidMember))).toEqual(expectedErrors);
    });
  });
});
