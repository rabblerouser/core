import { type } from '../userReducers';

describe('user reducers', () => {
  describe('type', () => {
    it('defaults to an empty string', () => {
      const reduction = type(undefined, { type: '' });
      expect(reduction).toEqual('');
    });

    it('is set to the user type upon USER_DETAILS_RECEIVED', () => {
      const reduction = type('', {
        type: 'USER_DETAILS_RECEIVED',
        payload: {
          type: 'SUPER',
        },
      });
      expect(reduction).toEqual('SUPER');
    });
  });
});
