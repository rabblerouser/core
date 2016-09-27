import { put, call } from 'redux-saga/effects';
import { fetchBranchList, registerMember } from '../sagas';
import { getBranches, register } from '../resources';
import {
  branchListUpdated,
  registerStart,
  registerSuccess,
  clearPageError,
  pageError,
} from '../actions';

describe('branch sagas', () => {
  describe('fetchBranchList', () => {
    it('handles a failed response from the server', () => {
      const reportsServerError = put(pageError('There was an error loading the page content'));

      const iterator = fetchBranchList();
      iterator.next();
      expect(iterator.throw().value).toEqual(reportsServerError);
    });

    it('fetches a branch list from the server', () => {
      const branches = [
        {
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          name: 'Branch 1',
        },
        {
          id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
          name: 'Branch 2',
        },
      ];

      const clearsAnyErrors = put(clearPageError());
      const requestsGetBranches = call(getBranches);
      const dispatchesBranches = put(branchListUpdated(branches));
      const dispatchesregisterStart = put(registerStart());

      const iterator = fetchBranchList();
      expect(iterator.next().value).toEqual(clearsAnyErrors);
      expect(iterator.next().value).toEqual(requestsGetBranches);
      expect(iterator.next({ branches }).value).toEqual(dispatchesBranches);
      expect(iterator.next().value).toEqual(dispatchesregisterStart);
    });
  });

  describe('registerMember', () => {
    it('handles a failed response from the server', () => {
      const onFailure = () => {};
      const reportsServerError = put(pageError('There was an error saving your changes'));
      const callsFailureCallback = call(onFailure);

      const iterator = registerMember({ member: {}, onFailure });
      iterator.next();
      expect(iterator.throw().value).toEqual(reportsServerError);
      expect(iterator.next().value).toEqual(callsFailureCallback);
    });

    it('registers the member details', () => {
      const onSuccess = () => {};
      const clearsAnyErrors = put(clearPageError());
      const requestsRegister = call(register, { name: 'person' });
      const dispatchesRegisterSuccess = put(registerSuccess());
      const callsSuccessCallback = call(onSuccess);

      const iterator = registerMember({ member: { name: 'person' }, onSuccess });
      expect(iterator.next().value).toEqual(clearsAnyErrors);
      expect(iterator.next().value).toEqual(requestsRegister);
      expect(iterator.next().value).toEqual(dispatchesRegisterSuccess);
      expect(iterator.next().value).toEqual(callsSuccessCallback);
    });
  });
});
