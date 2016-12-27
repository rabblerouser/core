import { members, selected, isEditing } from '../reducers.js';

describe('membersView / reducers', () => {
  describe('members', () => {
    it('defaults to an empty array', () => {
      const reduction = members(undefined, { type: '' });
      expect(reduction).toEqual([]);
    });

    it('is set to the list of members upon MEMBER_LIST_UPDATED', () => {
      const reduction = members([], {
        type: 'MEMBER_LIST_UPDATED',
        payload: {
          members: [
            { id: 1234, name: 'member 1' }, { id: 4567, name: 'member 2' },
          ],
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'member 1' }, { id: 4567, name: 'member 2' },
      ]);
    });

    it('removes the provided member upon MEMBER_REMOVED ', () => {
      const initialState = [
        { id: 1234, name: 'member 1' }, { id: 4567, name: 'member 2' },
      ];
      const reduction = members(initialState, {
        type: 'MEMBER_REMOVED',
        payload: {
          memberId: 1234,
        },
      });
      expect(reduction).toEqual([{ id: 4567, name: 'member 2' }]);
    });

    it('strips the old group from members upon GROUP_REMOVED', () => {
      const initialState = [
        {
          id: 1234,
          name: 'member 1',
          groups: [{ id: 'G1' }, { id: 'G2' }, { id: 'G3' }],
        },
      ];
      const reduction = members(initialState, {
        type: 'GROUP_REMOVED',
        payload: {
          id: 'G2',
        },
      });
      expect(reduction[0]).toEqual(
        {
          id: 1234,
          name: 'member 1',
          groups: [{ id: 'G1' }, { id: 'G3' }],
        }
      );
    });

    it('updates the member upon MEMBER_UPDATED ', () => {
      const initialState = [
        { id: 1234, name: 'member 1' }, { id: 4567, name: 'member 2' },
      ];
      const reduction = members(initialState, {
        type: 'MEMBER_UPDATED',
        payload: {
          member: { id: 4567, name: 'member 2 updated' },
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'member 1' }, { id: 4567, name: 'member 2 updated' },
      ]);
    });
  });

  describe('selected', () => {
    it('defaults to empty', () => {
      const reduction = selected(undefined, { type: '' });
      expect(reduction).toEqual('');
    });

    it('is set to the provided memberId upon EDIT_MEMBER', () => {
      const reduction = selected(4567, { type: 'EDIT_MEMBER',
        payload: {
          memberId: 1234,
        },
      });
      expect(reduction).toEqual(1234);
    });

    it('is set to empty upon FINISH_EDIT_MEMBER', () => {
      const reduction = selected({ id: 1234 }, { type: 'FINISH_EDIT_MEMBER' });
      expect(reduction).toEqual('');
    });
  });

  describe('isEditing', () => {
    it('defaults to false', () => {
      const reduction = isEditing(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon EDIT_MEMBER ', () => {
      const reduction = isEditing(false, { type: 'EDIT_MEMBER' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_MEMBER ', () => {
      const reduction = isEditing(true, { type: 'FINISH_EDIT_MEMBER' });
      expect(reduction).toEqual(false);
    });
  });
});
