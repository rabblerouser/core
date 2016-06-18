import applicationValidator from '../../../services/applicationValidator';

describe('applicationValidator', () => {
  describe('isValid', () => {
    const validApplication = {
      contactName: 'Sherlock',
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      memberBirthYear: '2000',
      branchSelection: 'Geelong',
      schoolType: 'Primary',
      contactLastName: 'Sherlock',
      memberLastName: 'Holmes',
      additionalInfo: 'More info for you!',
    };

    const validApplicationWithOptional = {
      contactName: 'Sherlock',
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      memberBirthYear: '2000',
      branchSelection: 'Geelong',
      schoolType: 'Primary',
      contactLastName: '',
      memberLastName: '',
      additionalInfo: '',
    };

    it('should return empty array of errors on valid member', () => {
      expect(applicationValidator.isValid(validApplication)).toEqual([]);
    });

    it('should return empty array of errors on valid member with optional fields', () => {
      expect(applicationValidator.isValid(validApplicationWithOptional)).toEqual([]);
    });

    it('should return array of errors on null member', () => {
      expect(applicationValidator.isValid(null).length).not.toBe(0);
    });

    it('should return array of errors when missing data', () => {
      const invalidApplication = {
        contactName: '',
        contactEmail: '',
        contactNumber: '',
        memberName: '',
        memberBirthYear: '',
        branchSelection: '',
        schoolType: '',
        contactLastName: '',
        memberLastName: '',
        additionalInfo: '',
      };
      const expectedErrors = [
        'contactName',
        'contactEmail',
        'contactNumber',
        'memberName',
        'memberBirthYear',
        'branchSelection',
        'schoolType',
      ];
      expect(applicationValidator.isValid(invalidApplication)).toEqual(expectedErrors);
    });
  });
});
