import { put, call } from 'redux-saga/effects';
import { fetchBranchList, deleteBranch, createBranch, updateBranch } from '../branchSagas';
import { clearMessages, reportFailure, reportSuccess } from '../../actions/appFeedbackActions';
import { branchListUpdated, branchRemoved, branchCreated, branchUpdated } from '../../actions/branchActions';

import branchService from '../../services/branchService.js';

describe('branch sagas', () => {
  const dispatchesClearMessages = put(clearMessages());

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
      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
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

      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(stepDeleteBranch, 'It should request the delete');
      expect(iterator.next().value).toEqual(stepDispatchUpdate, 'It should dispatch the success');
      expect(iterator.next().value).toEqual(stepReportSuccess, 'It should set a success message');
    });
  });

  describe('createBranch', () => {
    const stepCreateBranch = call(branchService.createBranch, { id: 1 });

    it('handles a failed response from the service', () => {
      const iterator = createBranch();
      const fetchFailurePayload = 'There was an error when contacting the server';
      const stepReportFailure = put(reportFailure(fetchFailurePayload));
      iterator.next();
      expect(iterator.throw().value).toEqual(stepReportFailure, 'It should dispatch the error');
    });

    it('creates the branch specified in the action', () => {
      const fetchSuccessPayload = { id: 1 };
      const iterator = createBranch({ branch: { id: 1 } });
      const stepDispatchUpdate = put(branchCreated({ id: 1 }));
      const stepReportSuccess = put(reportSuccess('Branch successfully added'));
      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(stepCreateBranch, 'It should request the create');
      expect(iterator.next(fetchSuccessPayload).value).toEqual(stepDispatchUpdate, 'It should dispatch the success');
      expect(iterator.next().value).toEqual(stepReportSuccess, 'It should set a success message');
    });
  });

  describe('updateBranch', () => {
    it('handles a failed response from the service', () => {
      const failure = () => {};

      const iterator = updateBranch({ payload: { failure } });
      const callsFailureCallback = call(failure);
      const dispatchesFailureReport = put(reportFailure('There was an error when contacting the server'));

      iterator.next();
      expect(iterator.throw().value).toEqual(callsFailureCallback, 'It should call the redux form failure callback');
      expect(iterator.next().value).toEqual(dispatchesFailureReport, 'It should dispatch the error');
    });

    it('updates the branch specified in the action', () => {
      const success = () => {};

      const iterator = updateBranch({ payload: { branch: { id: 1 }, success } });
      const callsUpdatedBranch = call(branchService.updateBranch, { id: 1 });
      const dispatchesUpdateAction = put(branchUpdated({ id: 1 }));
      const callsSuccessCallback = call(success);
      const dispatchesSuccessReport = put(reportSuccess('Branch successfully updated'));

      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(callsUpdatedBranch, 'It should request the update');
      expect(iterator.next().value).toEqual(dispatchesUpdateAction, 'It should dispatch the branch updated action');
      expect(iterator.next().value).toEqual(callsSuccessCallback, 'It calls the redux form success callback');
      expect(iterator.next().value).toEqual(dispatchesSuccessReport, 'It should set a success message');
    });
  });
});
