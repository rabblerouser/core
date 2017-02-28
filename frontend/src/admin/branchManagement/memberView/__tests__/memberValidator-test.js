import validator from '../memberValidator';

describe('member validator', () => {
  [
    'email',
    'name',
  ].forEach(fieldName => (
      it(`requires ${fieldName}`, () => {
        const errors = validator({
          phoneNumber: 'a value',
          additionalInfo: 'a value',
          notes: 'a value',
        });
        expect(errors[fieldName]).not.toBeUndefined();
      })),
    );

  [
    'phoneNumber',
    'additionalInfo',
    'notes',
  ].forEach(fieldName => (
      it(`doesn't require ${fieldName}`, () => {
        const errors = validator({});
        expect(errors[fieldName]).toBeUndefined();
      })),
  );
});
