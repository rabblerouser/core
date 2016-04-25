import applicationValidator from '../../../services/applicationValidator';

describe('applicationValidator', () => {
  describe('isValid', () => {
    const validApplication = {
      contactName: 'Sherlock',
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      participantName: 'Holmes',
      participantBirthYear: '2000',
      labSelection: 'Geelong',
      schoolType: 'Primary',
      contactLastName: 'Sherlock',
      participantLastName: 'Holmes',
      additionalInfo: 'More info for you!',
    };

    const validApplicationWithOptional = {
      contactName: 'Sherlock',
      contactEmail: 'sherlock@holmes.co.uk',
      contactNumber: '0396291146',
      participantName: 'Holmes',
      participantBirthYear: '2000',
      labSelection: 'Geelong',
      schoolType: 'Primary',
      contactLastName: '',
      participantLastName: '',
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
        participantName: '',
        participantBirthYear: '',
        labSelection: '',
        schoolType: '',
        contactLastName: '',
        participantLastName: '',
        additionalInfo: '',
      };
      const expectedErrors = [
        'contactName',
        'contactEmail',
        'contactNumber',
        'participantName',
        'participantBirthYear',
        'labSelection',
        'schoolType',
      ];
      expect(applicationValidator.isValid(invalidApplication)).toEqual(expectedErrors);
    });
  });
});
