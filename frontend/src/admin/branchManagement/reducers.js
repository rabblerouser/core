import { combineReducers } from 'redux';
import { reducers as branch } from './branchView/';
import { reducers as groups } from './groupView/';
import { reducers as members } from './memberView/';
import { reducers as admins } from './adminsView/';
export default combineReducers({
  branch,
  groups,
  members,
  admins,
});
