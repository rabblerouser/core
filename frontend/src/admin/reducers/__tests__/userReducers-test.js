import { type, email, getUserType, getUserEmail } from '../userReducers';

describe('user reducers', () => {
  describe('type', () => {
    it('defaults to an empty string', () => {
      const reduction = type(undefined, { type: 'SUPERPOWER' });
      expect(reduction).toEqual('');
    });

    it('is set to the user type upon USER_DETAILS_RECEIVED', () => {
      const reduction = type('', {
        type: 'USER_DETAILS_RECEIVED',
        payload: {
          type: 'SUPER',
          email: 'someone@mail.com',
          somethingElse: 'another thing',
        },
      });
      expect(reduction).toEqual('SUPER');
    });
  });

  describe('email', () => {
    it('defaults to an empty string', () => {
      const reduction = type(undefined, { email: 'donald@trump.com' });
      expect(reduction).toEqual('');
    });

    it('is set to the user email upon USER_DETAILS_RECEIVED', () => {
      const reduction = email('', {
        type: 'USER_DETAILS_RECEIVED',
        payload: {
          type: 'SUPER',
          email: 'someone@mail.com',
          somethingElse: 'another thing',
        },
      });
      expect(reduction).toEqual('someone@mail.com');
    });
  });
});

describe('user selectors', () => {
  describe('getUserType', () => {
    it('returns the user type ', () => {
      expect(getUserType({ user: { type: 'SUPER' } })).toEqual('SUPER');
    });
  });

  describe('getUserEmail', () => {
    it('returns the user email ', () => {
      expect(getUserEmail({ user: { email: 's@mail.com' } })).toEqual('s@mail.com');
    });
  });
});
