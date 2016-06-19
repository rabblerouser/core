import memberValidator from '../../../services/memberValidator';

describe('memberValidator', () => {
  describe('isValid', () => {
    const validMember = {
      contactName: 'Sherlock',
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      memberBirthYear: '2000',
      branchId: 'Geelong',
      contactLastName: 'Sherlock',
      memberLastName: 'Holmes',
      additionalInfo: 'More info for you!',
      pastoralNotes: 'Pastoral deets',
    };

    const validMemberWithOptional = {
      contactName: 'Sherlock',
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      memberBirthYear: '2000',
      branchId: 'Geelong',
      contactLastName: '',
      memberLastName: '',
      additionalInfo: '',
      pastoralNotes: '',
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
        contactName: '',
        contactEmail: '',
        contactNumber: '',
        memberName: '',
        memberBirthYear: '',
        branchId: '',
        contactLastName: '',
        memberLastName: '',
      };
      const expectedErrors = [
        'contactName',
        'contactEmail',
        'contactNumber',
        'memberName',
        'memberBirthYear',
      ];
      expect(memberValidator.isValid(invalidMember)).toEqual(expectedErrors);
    });
  });
});
