import { networkAdmins, selected, isEditing, isCreating } from '../reducers';

describe('networkAdminsView / reducers', () => {
  describe('networkAdmins', () => {
    it('defaults to an empty array', () => {
      const reduction = networkAdmins(undefined, { type: '' });
      expect(reduction).toEqual([]);
    });

    it('is set to the list of networkAdmins upon NETWORK_ADMIN_LIST_UPDATED', () => {
      const reduction = networkAdmins([], {
        type: 'NETWORK_ADMIN_LIST_UPDATED',
        payload: {
          networkAdmins: [
            { id: 1234, name: 'networkAdmin 1' }, { id: 4567, name: 'networkAdmin 2' },
          ],
        },
      });
      expect(reduction).toEqual([
        { id: 1234, name: 'networkAdmin 1' }, { id: 4567, name: 'networkAdmin 2' },
      ]);
    });

    it('removes the provided networkAdmin upon NETWORK_ADMIN_REMOVED ', () => {
      const initialState = [
        { id: 1234, name: 'networkAdmin 1' }, { id: 4567, name: 'networkAdmin 2' },
      ];
      const reduction = networkAdmins(initialState, {
        type: 'NETWORK_ADMIN_REMOVED',
        payload: {
          networkAdminId: 1234,
        },
      });
      expect(reduction).toEqual([{ id: 4567, name: 'networkAdmin 2' }]);
    });

    it('updates the networkAdmin upon NETWORK_ADMIN_UPDATED ', () => {
      const initialState = [
            { id: 1234, name: 'networkAdmin 1' }, { id: 4567, name: 'networkAdmin 2' },
      ];
      const reduction = networkAdmins(initialState, {
        type: 'NETWORK_ADMIN_UPDATED',
        payload: {
          networkAdmin: { id: 4567, name: 'networkAdmin 2 updated' },
        },
      });
      expect(reduction).toEqual([
            { id: 1234, name: 'networkAdmin 1' }, { id: 4567, name: 'networkAdmin 2 updated' },
      ]);
    });

    it('adds a networkAdmin upon NETWORK_ADMIN_CREATED ', () => {
      const initialState = [
            { id: 1234, name: 'networkAdmin 1' },
      ];
      const reduction = networkAdmins(initialState, {
        type: 'NETWORK_ADMIN_CREATED',
        payload: {
          networkAdmin: { id: 4567, name: 'networkAdmin 2' },
        },
      });
      expect(reduction).toEqual([
            { id: 1234, name: 'networkAdmin 1' }, { id: 4567, name: 'networkAdmin 2' },
      ]);
    });
  });

  describe('selected', () => {
    it('defaults to empty', () => {
      const reduction = selected(undefined, { type: '' });
      expect(reduction).toEqual('');
    });

    it('is set to the provided networkAdminId upon EDIT_NETWORK_ADMIN', () => {
      const reduction = selected(4567, { type: 'EDIT_NETWORK_ADMIN',
        payload: {
          networkAdminId: 1234,
        },
      });
      expect(reduction).toEqual(1234);
    });

    it('is set to empty upon FINISH_EDIT_NETWORK_ADMIN', () => {
      const reduction = selected({ id: 1234 }, { type: 'FINISH_EDIT_NETWORK_ADMIN' });
      expect(reduction).toEqual('');
    });
  });

  describe('isEditing', () => {
    it('defaults to false', () => {
      const reduction = isEditing(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon EDIT_NETWORK_ADMIN ', () => {
      const reduction = isEditing(false, { type: 'EDIT_NETWORK_ADMIN' });
      expect(reduction).toEqual(true);
    });

    it('is set to true upon CREATE_NETWORK_ADMIN ', () => {
      const reduction = isEditing(false, { type: 'CREATE_NETWORK_ADMIN' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_NETWORK_ADMIN ', () => {
      const reduction = isEditing(true, { type: 'FINISH_EDIT_NETWORK_ADMIN' });
      expect(reduction).toEqual(false);
    });
  });

  describe('isCreating', () => {
    it('defaults to false', () => {
      const reduction = isCreating(undefined, { type: '' });
      expect(reduction).toEqual(false);
    });

    it('is set to true upon CREATE_NETWORK_ADMIN', () => {
      const reduction = isCreating(false, { type: 'CREATE_NETWORK_ADMIN' });
      expect(reduction).toEqual(true);
    });

    it('is set to false upon FINISH_EDIT_NETWORK_ADMIN ', () => {
      const reduction = isCreating(true, { type: 'FINISH_EDIT_NETWORK_ADMIN' });
      expect(reduction).toEqual(false);
    });
  });
});
