import * as ajax from '../ajax';
import { urls } from '../strings';
import { getBranches, register } from '../resources';

describe('resources', () => {
  describe('get', () => {
    it('passes args through and returns a promise', done => {
      spyOn(ajax, 'get').and.returnValue(Promise.resolve('ajax value'));
      getBranches()
      .then(result => {
        expect(ajax.get).toHaveBeenCalledWith(urls.branchList);
        expect(result).toEqual('ajax value');
        done();
      });
    });
  });

  describe('post', () => {
    it('passes args through and returns a promise', done => {
      const data = { some: 'data' };
      spyOn(ajax, 'post').and.returnValue(Promise.resolve('ajax value'));
      register(data)
      .then(result => {
        expect(ajax.post).toHaveBeenCalledWith(urls.register, data);
        expect(result).toEqual('ajax value');
        done();
      });
    });
  });
});
