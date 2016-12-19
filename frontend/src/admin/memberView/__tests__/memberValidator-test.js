import validator from '../memberValidator';

describe('member validator', () => {
  [
    'email',
    'firstName',
  ].forEach(fieldName => (
      it(`requires ${fieldName}`, () => {
        const errors = validator({
          lastName: 'a value',
          primaryPhoneNumber: 'a value',
          additionalInfo: 'a value',
          notes: 'a value',
        });
        expect(errors[fieldName]).not.toBeUndefined();
      }))
    );

  [
    'lastName',
    'primaryPhoneNumber',
    'additionalInfo',
    'notes',
  ].forEach(fieldName => (
      it(`doesn't require ${fieldName}`, () => {
        const errors = validator({});
        expect(errors[fieldName]).toBeUndefined();
      }))
  );
});
