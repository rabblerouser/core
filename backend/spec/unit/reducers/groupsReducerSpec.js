const groups = require('../../../src/reducers/groupsReducer');

describe('groupsReducer', () => {
  it('is empty by default', () => {
    expect(groups(undefined, {})).to.eql([]);
  });

  it('is unchanged when the action is unknown', () => {
    expect(groups([1, 2, 3], { type: 'GARBAGE' })).to.eql([1, 2, 3]);
  });

  describe('CREATE_GROUP', () => {
    it('appends the new group', () => {
      const action = { type: 'CREATE_GROUP', group: { id: '2' } };

      const newState = groups([{ id: '1' }], action);

      expect(newState).to.eql([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('DELETE_GROUP', () => {
    it('deletes the group', () => {
      const action = { type: 'DELETE_GROUP', group: { id: '2' } };

      const newState = groups([{ id: '1' }, { id: '2' }], action);

      expect(newState).to.eql([{ id: '1' }]);
    });
  });

  describe('UPDATE_GROUP', () => {
    it('updates the group', () => {
      const originalState = [
        { id: '1', name: 'People' },
        { id: '2', name: 'Aliens' },
        { id: '3', name: 'Etheral Beings' },
      ];
      const action = { type: 'UPDATE_GROUP', group: { id: '2', name: 'Old Ones' } };
      const newState = groups(originalState, action);
      expect(newState).to.eql([
        { id: '1', name: 'People' },
        { id: '2', name: 'Old Ones' },
        { id: '3', name: 'Etheral Beings' },
      ]);
    });
  });
});
