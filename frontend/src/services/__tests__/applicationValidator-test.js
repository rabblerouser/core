import applicationValidator from '../applicationValidator';

describe('applicationValidator', () => {
  describe('isValid', () => {
    it('should return empty array of errors on valid member', () => {
      const validApplication = {
        contactEmail: 'sherlock@holmes.co.uk',
        memberName: 'Holmes',
        branchSelection: 'Geelong',
        memberLastName: 'Holmes',
        additionalInfo: 'More info for you!',
      };

      expect(applicationValidator.isValid(validApplication)).toEqual([]);
    });

    it('should return empty array of errors on valid member with optional fields', () => {
      const validApplicationWithOptional = {
        contactEmail: 'sherlock@holmes.co.uk',
        contactNumber: '0396291146',
        memberName: 'Holmes',
        branchSelection: 'Geelong',
        memberLastName: '',
        additionalInfo: '',
      };

      expect(applicationValidator.isValid(validApplicationWithOptional)).toEqual([]);
    });

    it('should return array of errors on null member', () => {
      expect(applicationValidator.isValid(null).length).not.toBe(0);
    });

    it('should return array of errors when missing data', () => {
      const invalidApplication = {
        contactEmail: '',
        memberName: '',
        branchSelection: '',
        memberLastName: '',
        additionalInfo: '',
      };
      const expectedErrors = [
        'contactEmail',
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
