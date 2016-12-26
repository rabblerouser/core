import validator from '../networkAdminValidator';

describe('networkAdmin validator', () => {
  [
    'email',
  ].forEach(fieldName => (
      it(`requires ${fieldName}`, () => {
        const errors = validator({
          contactNumber: 'a value',
          name: 'a value',
          password: 'at least twelve characters',
          confirmPassword: 'a value',
        }, {});
        expect(errors[fieldName]).not.toBeUndefined();
      }))
    );

  [
    'contactNumber',
    'name',
    'password',
    'confirmPassword',
  ].forEach(fieldName => (
      it(`doesn't require ${fieldName}`, () => {
        const errors = validator({}, {});
        expect(errors[fieldName]).toBeUndefined();
      }))
  );

  it('has a validation error if there is no password when the admin is being created', () => {
    const errors = validator({}, { isCreating: true });
    expect(errors.password).not.toBeUndefined();
  });

  it('has a validation error if the password and confirmed password don\'t match ', () => {
    const errors = validator({
      contactNumber: 'a value',
      email: 'a value',
      name: 'a value',
      password: 'a value',
      confirmPassword: 'a different value',
    }, {});
    expect(errors.confirmPassword).not.toBeUndefined();
  });
});
