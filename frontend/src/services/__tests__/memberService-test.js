import memberService from '../memberService';

describe('memberService', () => {
  let server;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
  });

  describe('update', () => {
    // TODO!
  });

  describe('deleteMember', () => {
    it('can successfully delete the member', done => {
      server.respondWith('DELETE', '/branches/1234/members/5678', [200, {
        'Content-Type': 'application/json',
      }, JSON.stringify({ some: 'response' })]);

      memberService.deleteMember('5678', '1234')
        .then(result => {
          expect(result).toEqual({ some: 'response' });
          done();
        })
        .catch(() => {
          done.fail('Expected promise to be resolved');
        });
    });

    it('can fail to delete the member', done => {
      server.respondWith('DELETE', 'branches/1234/members/5678', [500, {
        'Content-Type': 'application/json',
      }, '']);

      memberService.deleteMember('5678, 1234')
        .then(() => {
          done.fail('Expected promise to be rejected');
        })
        .catch(() => {
          done();
        });
    });
  });
});
