const members = require('../../../src/reducers/membersReducer');

describe('membersReducer', () => {
  it('is empty by default', () => {
    expect(members(undefined, {})).to.eql([]);
  });

  it('is unchanged when the action is unknown', () => {
    expect(members([1, 2, 3], { type: 'GARBAGE' })).to.eql([1, 2, 3]);
  });

  describe('CREATE_MEMBER', () => {
    it('appends the new member, and gives them no groups', () => {
      const action = { type: 'CREATE_MEMBER', member: { id: '2' } };
      const newState = members([{ id: '1', groups: ['some-group'] }], action);
      expect(newState).to.eql([
        { id: '1', groups: ['some-group'] },
        { id: '2', groups: [] },
      ]);
    });
  });

  describe('DELETE_MEMBER', () => {
    it('deletes the member', () => {
      const action = { type: 'DELETE_MEMBER', member: { id: '2' } };
      const newState = members([{ id: '1' }, { id: '2' }], action);
      expect(newState).to.eql([{ id: '1' }]);
    });
  });

  describe('UPDATE_MEMBER', () => {
    it('updates the member', () => {
      const originalState = [
        { id: '1', name: 'Sherlock' },
        { id: '2', name: 'John' },
        { id: '3', name: 'Watson' },
      ];
      const action = { type: 'UPDATE_MEMBER', member: { id: '2', name: 'Jane' } };
      const newState = members(originalState, action);
      expect(newState).to.eql([
        { id: '1', name: 'Sherlock' },
        { id: '2', name: 'Jane' },
        { id: '3', name: 'Watson' },
      ]);
    });
  });

  describe('DELETE_GROUP', () => {
    it('removes the group from any members who were in that group', () => {
      const action = { type: 'DELETE_GROUP', group: { id: 'b' } };
      const originalState = [
        { id: '1', name: 'Batman', groups: [] },
        { id: '2', name: 'Robin', groups: ['a', 'b', 'c'] },
        { id: '3', name: 'Wonder Woman', groups: ['b'] },
      ];
      const newState = members(originalState, action);
      expect(newState).to.eql([
        { id: '1', name: 'Batman', groups: [] },
        { id: '2', name: 'Robin', groups: ['a', 'c'] },
        { id: '3', name: 'Wonder Woman', groups: [] },
      ]);
    });
  });
});
