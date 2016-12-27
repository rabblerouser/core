import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import branchReducers from '../../../reducers/branchReducers';
import * as rootSelectors from '../../../reducers/rootSelectors';
import * as selectors from '../../selectors';

export const fixtures = {
  branches: [{
    id: '1234',
    name: 'Test Branch',
    contact: 'Contact details for the branch',
    notes: 'Some notes about the branch',
  }],
  selectedBranch: '1234',
};

export const initialiseStore = (componentReducers, componentSelector) => {
  spyOn(selectors, componentSelector).and.callFake(state => state.componentRoot);
  spyOn(rootSelectors, 'getBranches').and.callFake(state => state.branches);

  const initialState = {
    branches: {
      branches: fixtures.branches,
      selectedBranch: fixtures.selectedBranch,
    },
  };

  return createStore(
    combineReducers({
      form: formReducer,
      componentRoot: componentReducers,
      branches: branchReducers,
    }),
    initialState,
    applyMiddleware(thunk)
  );
};
