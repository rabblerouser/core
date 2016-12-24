import { admins } from '../reducers.js';

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
  });
});

