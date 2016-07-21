import applicationValidator from '../../../services/applicationValidator';

describe('applicationValidator', () => {
  describe('isValid', () => {
    const validApplication = {
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      branchSelection: 'Geelong',
      memberLastName: 'Holmes',
      additionalInfo: 'More info for you!',
    };

    const validApplicationWithOptional = {
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      memberName: 'Holmes',
      branchSelection: 'Geelong',
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
        contactEmail: '',
        contactNumber: '',
        memberName: '',
        branchSelection: '',
        memberLastName: '',
        additionalInfo: '',
      };
      const expectedErrors = [
        'contactEmail',
        'contactNumber',
        'memberName',
        'branchSelection',
      ];
      const errors = applicationValidator.isValid(invalidApplication);
      expectedErrors.forEach(error => {
        expect(errors).toContain(error);
      });
    });
  });
});
