import validator from '../groupValidator';

describe('group validator', () => {
  it('requires a name', () => {
    const errors = validator({ description: 'Description' });
    expect(errors).toEqual({ name: 'Please enter a group name. No symbols allowed.' });
  });

  it('requires a description', () => {
    const errors = validator({ name: 'Name' });
    expect(errors).toEqual({ description: 'Please enter a description (maximum 2000 characters).' });
  });
});
