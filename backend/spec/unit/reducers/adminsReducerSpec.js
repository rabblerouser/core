const admins = require('../../../src/reducers/adminsReducer');

describe('adminsReducer', () => {
  it('is empty by default', () => {
    expect(admins(undefined, {})).to.eql([]);
  });

  it('is unchanged when the action is unknown', () => {
    expect(admins([1, 2, 3], { type: 'GARBAGE' })).to.eql([1, 2, 3]);
  });

  describe('CREATE_ADMIN', () => {
    it('appends the new admin', () => {
      const action = { type: 'CREATE_ADMIN', admin: { id: '2' } };

      const newState = admins([{ id: '1' }], action);

      expect(newState).to.eql([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('DELETE_ADMIN', () => {
    it('deletes the admin', () => {
      const action = { type: 'DELETE_ADMIN', admin: { id: '2' } };

      const newState = admins([{ id: '1' }, { id: '2' }], action);

      expect(newState).to.eql([{ id: '1' }]);
    });
  });

  describe('UPDATE_ADMIN', () => {
    it('updates the admin', () => {
      const originalState = [
        { id: '1', name: 'Wolverine' },
        { id: '2', name: 'Storm' },
        { id: '3', name: 'Rogue' },
      ];
      const action = { type: 'UPDATE_ADMIN', admin: { id: '2', name: 'Magneto' } };
      const newState = admins(originalState, action);
      expect(newState).to.eql([
        { id: '1', name: 'Wolverine' },
        { id: '2', name: 'Magneto' },
        { id: '3', name: 'Rogue' },
      ]);
    });
  });
});
