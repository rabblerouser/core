import validator from '../branchValidator';

describe('branch validator', () => {
  it('requires a name', () => {
    const errors = validator({ description: 'Description' });
    expect(errors).toEqual({ name: 'Please enter a name. No symbols allowed.' });
  });
});
