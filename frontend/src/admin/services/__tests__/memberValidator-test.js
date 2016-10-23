import memberValidator from '../memberValidator';

describe('memberValidator', () => {
  describe('isValid', () => {
    const validMember = {
      contactEmail: 'sherlock@holmes.co.uk',
      memberName: 'Holmes',
      branchId: 'Geelong',
      memberLastName: 'Holmes',
      additionalInfo: 'More info for you!',
      notes: 'deets',
    };

    const validMemberWithOptional = {
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      branchId: 'Geelong',
      memberLastName: '',
      additionalInfo: '',
      notes: '',
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
      const invalidMember = {
        contactEmail: '',
        contactNumber: '',
        memberName: '',
        branchId: '',
        memberLastName: '',
      };
      const expectedErrors = [
        'contactEmail',
        'memberName',
      ];
      expect(memberValidator.isValid(invalidMember)).toEqual(expectedErrors);
    });
  });
});
