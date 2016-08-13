import { put, call } from 'redux-saga/effects';
import { fetchBranchList, deleteBranch } from '../branchSagas';
import { clearMessages, reportFailure, reportSuccess } from '../../actions/appFeedbackActions';
import { branchListUpdated, branchRemoved } from '../../actions/branchActions';

import branchService from '../../services/branchService.js';

describe('branch sagas', () => {
  const stepClearMessages = put(clearMessages());

  describe('fetchBranchList', () => {
    const stepGetBranches = call(branchService.getMyBranches);

    it('handles a failed response from the service', () => {
      const iterator = fetchBranchList();
      const fetchFailurePayload = 'There was an error when contacting the server';
      const stepReportFailure = put(reportFailure(fetchFailurePayload));
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
      const stepDispatchUpdate = put(branchListUpdated(fetchSuccessPayload));
      expect(iterator.next().value).toEqual(stepClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(stepGetBranches, 'It should get the branch list');
      expect(iterator.next(fetchSuccessPayload).value).toEqual(stepDispatchUpdate, 'It should dispatch the update');
    });
  });

  describe('deleteBranch', () => {
    const stepDeleteBranch = call(branchService.deleteBranch, { id: 1 });

    it('handles a failed response from the service', () => {
      const iterator = deleteBranch();
      const fetchFailurePayload = 'There was an error when contacting the server';
      const stepReportFailure = put(reportFailure(fetchFailurePayload));
      iterator.next();
      expect(iterator.throw().value).toEqual(stepReportFailure, 'It should dispatch the error');
    });

    it('deletes the branch specified in the action', () => {
      const iterator = deleteBranch({ branch: { id: 1 } });
      const stepDispatchUpdate = put(branchRemoved({ id: 1 }));
      const stepReportSuccess = put(reportSuccess('Branch successfully removed'));

      expect(iterator.next().value).toEqual(stepClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(stepDeleteBranch, 'It should request the delete');
      expect(iterator.next().value).toEqual(stepDispatchUpdate, 'It should dispatch the success');
      expect(iterator.next().value).toEqual(stepReportSuccess, 'It should set a success message');
    });
  });
});
