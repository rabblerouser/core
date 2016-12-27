import { admins, selected, isEditing, isCreating } from '../reducers';

describe('adminsView / reducers', () => {
  describe('admins', () => {
    it('defaults to an empty array', () => {
      const reduction = admins(undefined, { type: '' });
      expect(reduction).toEqual([]);
    });

    it('is set to the list of admins upon ADMIN_LIST_UPDATED', () => {
      const reduction = admins([], {
        type: 'ADMIN_LIST_UPDATED',
        payload: {
          admins: [
            { id: 1234, name: 'admin 1' }, { id: 4567, name: 'admin 2' },
          ],
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'admin 1' }, { id: 4567, name: 'admin 2' },
      ]);
    });

    it('removes the provided admin upon ADMIN_REMOVED ', () => {
      const initialState = [
        { id: 1234, name: 'admin 1' }, { id: 4567, name: 'admin 2' },
      ];
      const reduction = admins(initialState, {
        type: 'ADMIN_REMOVED',
        payload: {
          adminId: 1234,
        },
      });
      expect(reduction).toEqual([{ id: 4567, name: 'admin 2' }]);
    });

    it('updates the admin upon ADMIN_UPDATED ', () => {
      const initialState = [
            { id: 1234, name: 'admin 1' }, { id: 4567, name: 'admin 2' },
      ];
      const reduction = admins(initialState, {
        type: 'ADMIN_UPDATED',
        payload: {
          admin: { id: 4567, name: 'admin 2 updated' },
        },
      });
      expect(reduction).toEqual([
            { id: 1234, name: 'admin 1' }, { id: 4567, name: 'admin 2 updated' },
      ]);
    });

    it('adds a admin upon ADMIN_CREATED ', () => {
      const initialState = [
            { id: 1234, name: 'admin 1' },
      ];
      const reduction = admins(initialState, {
        type: 'ADMIN_CREATED',
        payload: {
          admin: { id: 4567, name: 'admin 2' },
        },
      });
      expect(reduction).toEqual([
            { id: 1234, name: 'admin 1' }, { id: 4567, name: 'admin 2' },
      ]);
    });
  });

  describe('selected', () => {
    it('defaults to empty', () => {
      const reduction = selected(undefined, { type: '' });
      expect(reduction).toEqual('');
    });

    it('is set to the provided adminId upon EDIT_ADMIN', () => {
      const reduction = selected(4567, { type: 'EDIT_ADMIN',
        payload: {
          adminId: 1234,
        },
      });
      expect(reduction).toEqual(1234);
    });

    it('is set to empty upon FINISH_EDIT_ADMIN', () => {
      const reduction = selected({ id: 1234 }, { type: 'FINISH_EDIT_ADMIN' });
      expect(reduction).toEqual('');
    });
  });

  describe('isEditing', () => {
    it('defaults to false', () => {
      const reduction = isEditing(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon EDIT_ADMIN ', () => {
      const reduction = isEditing(false, { type: 'EDIT_ADMIN' });
      expect(reduction).toEqual(true);
    });

    it('is set to true upon CREATE_ADMIN ', () => {
      const reduction = isEditing(false, { type: 'CREATE_ADMIN' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_ADMIN ', () => {
      const reduction = isEditing(true, { type: 'FINISH_EDIT_ADMIN' });
      expect(reduction).toEqual(false);
    });
  });

  describe('isCreating', () => {
    it('defaults to false', () => {
      const reduction = isCreating(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon CREATE_ADMIN', () => {
      const reduction = isCreating(false, { type: 'CREATE_ADMIN' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_ADMIN ', () => {
      const reduction = isCreating(true, { type: 'FINISH_EDIT_ADMIN' });
      expect(reduction).toEqual(false);
    });
  });
});
