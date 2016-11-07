import { combineReducers } from 'redux';
import { isEditing, editedBranch } from './reducers';

export const reducers = combineReducers({
  isEditing,
  editedBranch,
});

import view from './BranchDetails';
export default view;
