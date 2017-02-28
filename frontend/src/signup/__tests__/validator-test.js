import validator from '../validator';

describe('validator', () => {
  describe('isValid', () => {
    const validMember = {
      email: 'sherlock@holmes.co.uk',
      name: 'Holmes',
      branchId: 'Geelong',
      additionalInfo: 'More info for you!',
    };

    const validMemberWithOptional = {
      email: 'sherlock@holmes.co.uk',
      phoneNumber: '0396291146',
      name: 'Holmes',
      branchId: 'Geelong',
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
        phoneNumber: '',
        name: '',
        branchId: '',
      };
      const expectedErrors = [
        'branchId',
        'email',
        'name',
      ];
      expect(Object.keys(validator(invalidMember))).toEqual(expectedErrors);
    });
  });
});
