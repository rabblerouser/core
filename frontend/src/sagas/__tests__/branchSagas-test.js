import { put, call } from 'redux-saga/effects';
import { fetchBranchList } from '../branchSagas';
import { clearMessages, reportFailure } from '../../actions/appFeedbackActions';
import { branchListUpdated } from '../../actions/branchActions';

import branchService from '../../services/branchService.js';

describe('branch sagas', () => {
  describe('fetchBranchList', () => {
    it('handles a failed response from the service', () => {
      const iterator = fetchBranchList();
      const fetchFailurePayload = 'There was an error when contacting the server';
      const stepReportFailure = put(reportFailure(fetchFailurePayload));
      iterator.next();
      iterator.next();

      expect(iterator.throw(fetchFailurePayload).value).toEqual(stepReportFailure, 'It should dispatch the error');
    });

    it('fetches a branch list for the redux store', () => {
      const iterator = fetchBranchList();
      const fetchSuccessPayload = [
        {
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          name: 'Branch 1',
        },
        {
          id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
          name: 'Branch 2',
        },
      ];
      const stepClearMessages = put(clearMessages());
      const stepGetBranches = call(branchService.getMyBranches);
      const stepDispatchUpdate = put(branchListUpdated(fetchSuccessPayload));

      expect(iterator.next().value).toEqual(stepClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(stepGetBranches, 'It should get the branch list');
      expect(iterator.next(fetchSuccessPayload).value).toEqual(stepDispatchUpdate, 'It should dispatch the update');
    });
  });
});
