const branches = require('../../../src/reducers/branchesReducer');

describe('branchesReducer', () => {
  it('is empty by default', () => {
    expect(branches(undefined, {})).to.eql([]);
  });

  it('is unchanged when the action is unknown', () => {
    expect(branches([1, 2, 3], { type: 'GARBAGE' })).to.eql([1, 2, 3]);
  });

  describe('CREATE_BRANCH', () => {
    it('appends the new branch', () => {
      const action = { type: 'CREATE_BRANCH', branch: { id: '2' } };

      const newState = branches([{ id: '1' }], action);

      expect(newState).to.eql([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('DELETE_BRANCH', () => {
    it('deletes the branch', () => {
      const action = { type: 'DELETE_BRANCH', branch: { id: '2' } };

      const newState = branches([{ id: '1' }, { id: '2' }], action);

      expect(newState).to.eql([{ id: '1' }]);
    });
  });

  describe('UPDATE_BRANCH', () => {
    it('updates the branch', () => {
      const originalState = [
        { id: '1', name: 'Melbourne' },
        { id: '2', name: 'Sydney' },
        { id: '3', name: 'Perth' },
      ];
      const action = { type: 'UPDATE_BRANCH', branch: { id: '2', name: 'Brisbane' } };
      const newState = branches(originalState, action);
      expect(newState).to.eql([
        { id: '1', name: 'Melbourne' },
        { id: '2', name: 'Brisbane' },
        { id: '3', name: 'Perth' },
      ]);
    });
  });
});
