import { groups, selected, isEditing, isCreating } from '../reducers';

describe('groupsView / reducers', () => {
  describe('groups', () => {
    it('defaults to an empty array', () => {
      const reduction = groups(undefined, { type: '' });
      expect(reduction).toEqual([]);
    });

    it('is set to the list of groups upon GROUP_LIST_UPDATED ', () => {
      const reduction = groups([], {
        type: 'GROUP_LIST_UPDATED',
        payload: {
          groups: [
            { id: 1234, name: 'group 1' }, { id: 4567, name: 'group 2' },
          ],
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'group 1' }, { id: 4567, name: 'group 2' },
      ]);
    });

    it('removes the provided group upon GROUP_REMOVED ', () => {
      const initialState = [
        { id: 1234, name: 'group 1' }, { id: 4567, name: 'group 2' },
      ];
      const reduction = groups(initialState, {
        type: 'GROUP_REMOVED',
        payload: {
          groupId: 1234,
        },
      });
      expect(reduction).toEqual([{ id: 4567, name: 'group 2' }]);
    });

    it('updates the group upon GROUP_UPDATED ', () => {
      const initialState = [
        { id: 1234, name: 'group 1' }, { id: 4567, name: 'group 2' },
      ];
      const reduction = groups(initialState, {
        type: 'GROUP_UPDATED',
        payload: {
          group: { id: 4567, name: 'group 2 updated' },
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'group 1' }, { id: 4567, name: 'group 2 updated' },
      ]);
    });

    it('adds a group upon GROUP_CREATED ', () => {
      const initialState = [
        { id: 1234, name: 'group 1' },
      ];
      const reduction = groups(initialState, {
        type: 'GROUP_CREATED',
        payload: {
          group: { id: 4567, name: 'group 2' },
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'group 1' }, { id: 4567, name: 'group 2' },
      ]);
    });
  });

  describe('selected', () => {
    it('defaults to "unassigned" ', () => {
      const reduction = selected(undefined, { type: '' });
      expect(reduction).toEqual('unassigned');
    });

    it('is set to the provided groupId upon GROUP_SELECTED', () => {
      const reduction = selected(4567, { type: 'GROUP_SELECTED',
        payload: {
          groupId: 1234,
        },
      });
      expect(reduction).toEqual(1234);
    });

    it('is set to undefined upon GROUP_REMOVED', () => {
      const reduction = selected({ id: 1234 }, { type: 'GROUP_REMOVED' });
      expect(reduction).toEqual('unassigned');
    });
  });

  describe('isEditing', () => {
    it('defaults to false', () => {
      const reduction = isEditing(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon CREATE_GROUP ', () => {
      const reduction = isEditing(false, { type: 'CREATE_GROUP' });
      expect(reduction).toEqual(true);
    });

    it('is set to true upon EDIT_GROUP ', () => {
      const reduction = isEditing(false, { type: 'EDIT_GROUP' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_GROUP ', () => {
      const reduction = isEditing(true, { type: 'FINISH_EDIT_GROUP' });
      expect(reduction).toEqual(false);
    });
  });

  describe('isCreating', () => {
    it('defaults to false', () => {
      const reduction = isCreating(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon CREATE_GROUP ', () => {
      const reduction = isCreating(false, { type: 'CREATE_GROUP' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_GROUP ', () => {
      const reduction = isCreating(true, { type: 'FINISH_EDIT_GROUP' });
      expect(reduction).toEqual(false);
    });
  });
});
