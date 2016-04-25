import adminValidator from '../../../services/adminValidator';

describe('adminValidator', () => {
  describe('isValidWithoutPassword', () => {
    const validAdmin = {
      email: 'sherlock@holmes.co.uk',
    };

    const validAdminWithOptional = {
      name: 'Sherlock',
      email: 'sherlock@holmes.co.uk',
      phoneNumber: '0396291146',
    };

    it('should return empty array of errors on valid admin', () => {
      expect(adminValidator.isValidWithoutPassword(validAdmin)).toEqual([]);
    });

    it('should return empty array of errors on valid admin with optional fields', () => {
      expect(adminValidator.isValidWithoutPassword(validAdminWithOptional)).toEqual([]);
    });

    it('should return array of errors on null admin', () => {
      expect(adminValidator.isValidWithoutPassword(null).length).not.toBe(0);
    });

    it('should return array of errors when missing data', () => {
      const invalidAdmin = {
        email: '',
      };
      const expectedErrors = ['email'];
      expect(adminValidator.isValidWithoutPassword(invalidAdmin)).toEqual(expectedErrors);
    });
  });

  describe('isValid', () => {
    const validAdmin = {
      email: 'sherlock@holmes.co.uk',
      password: 'This is a valid password',
    };

    const validAdminWithOptional = {
      name: 'Sherlock',
      email: 'sherlock@holmes.co.uk',
      phoneNumber: '0396291146',
      password: 'This is a valid password',
    };

    it('should return empty array of errors on valid admin', () => {
      expect(adminValidator.isValid(validAdmin)).toEqual([]);
    });

    it('should return empty array of errors on valid admin with optional fields', () => {
      expect(adminValidator.isValid(validAdminWithOptional)).toEqual([]);
    });

    it('should return array of errors on null admin', () => {
      expect(adminValidator.isValid(null).length).not.toBe(0);
    });

    it('should return array of errors when missing data', () => {
      const invalidAdmin = {
        email: '',
        password: '',
      };
      const expectedErrors = ['email', 'password'];
      expect(adminValidator.isValid(invalidAdmin)).toEqual(expectedErrors);
    });
  });
});
