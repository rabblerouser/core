import { put, call } from 'redux-saga/effects';
import { deleteBranch, createBranch, updateBranch } from '../sagas';
import { clearMessages, reportFailure, reportSuccess } from '../../actions/appFeedbackActions';
import {
  branchRemoved,
  branchCreated,
  branchUpdated,
} from '../actions';
import { branchListRequested } from '../../actions/branchActions';
import axios from 'axios';

describe('branch sagas', () => {
  const dispatchesClearMessages = put(clearMessages());

  describe('createBranch', () => {
    it('handles a failed response from the service', () => {
      const failure = () => {};

      const iterator = createBranch({ payload: { failure } });
      const callsFailureCallback = call(failure);
      const dispatchesFailureReport = put(reportFailure('There was an error when contacting the server'));

      iterator.next();
      expect(iterator.throw().value).toEqual(callsFailureCallback, 'It should call the redux form failure callback');
      expect(iterator.next().value).toEqual(dispatchesFailureReport, 'It should dispatch the error');
    });

    it('creates the branch specified in the action', () => {
      const success = () => {};

      const iterator = createBranch({ payload: { branch: { id: 1 }, success } });
      const callsCreateBranch = call(axios.post, '/branches/', { id: 1 });
      const dispatchesCreatedAction = put(branchCreated({ id: 1 }));
      const dispatchesRefreshBranchList = put(branchListRequested());
      const callsSuccessCallback = call(success);
      const dispatchesSuccessReport = put(reportSuccess('Branch successfully added'));

      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(callsCreateBranch, 'It should request the create');
      expect(iterator.next({ data: { id: 1 } }).value)
      .toEqual(dispatchesRefreshBranchList, 'It should refresh the branch list');
      expect(iterator.next().value).toEqual(dispatchesCreatedAction, 'It should dispatch the branch created action');
      expect(iterator.next().value).toEqual(callsSuccessCallback, 'It calls the redux form success callback');
      expect(iterator.next().value).toEqual(dispatchesSuccessReport, 'It should set a success message');
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
      const callsUpdateBranch = call(axios.put, '/branches/1/', { id: 1 });
      const dispatchesUpdatedAction = put(branchUpdated({ id: 1 }));
      const dispatchesRefreshBranchList = put(branchListRequested());
      const callsSuccessCallback = call(success);
      const dispatchesSuccessReport = put(reportSuccess('Branch successfully updated'));

      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(callsUpdateBranch, 'It should request the update');
      expect(iterator.next().value).toEqual(dispatchesRefreshBranchList, 'It should refresh the branch list');
      expect(iterator.next().value).toEqual(dispatchesUpdatedAction, 'It should dispatch the branch updated action');
      expect(iterator.next().value).toEqual(callsSuccessCallback, 'It calls the redux form success callback');
      expect(iterator.next().value).toEqual(dispatchesSuccessReport, 'It should set a success message');
    });
  });

  describe('deleteBranch', () => {
    it('handles a failed response from the service', () => {
      const iterator = deleteBranch({ branch: {} });
      const fetchFailurePayload = 'There was an error when contacting the server';
      const stepReportFailure = put(reportFailure(fetchFailurePayload));
      iterator.next();
      expect(iterator.throw().value).toEqual(stepReportFailure, 'It should dispatch the error');
    });

    it('deletes the branch specified in the action', () => {
      const iterator = deleteBranch({ branch: { id: 1 } });
      const callsDeleteBranch = call(axios.delete, '/branches/1/', { id: 1 });
      const dispatchesRefreshBranchList = put(branchListRequested());
      const stepDispatchUpdate = put(branchRemoved({ id: 1 }));
      const stepReportSuccess = put(reportSuccess('Branch successfully removed'));

      expect(iterator.next().value).toEqual(dispatchesClearMessages, 'It should clear messages');
      expect(iterator.next().value).toEqual(callsDeleteBranch, 'It should request the delete');
      expect(iterator.next().value).toEqual(dispatchesRefreshBranchList, 'It should refresh the branch list');
      expect(iterator.next().value).toEqual(stepDispatchUpdate, 'It should dispatch the success');
      expect(iterator.next().value).toEqual(stepReportSuccess, 'It should set a success message');
    });
  });
});
