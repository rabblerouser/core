import Q from 'q';
import ajax from '../../lib/ajax';
import { Resources } from '../config/strings';
import groupAdapter from '../adapters/groupAdapter.js';
import branchAdapter from '../adapters/branchAdapter.js';
import memberAdapter from '../adapters/memberAdapter.js';
import adminAdapter from '../adapters/adminAdapter.js';

const handleResponseError = error => {
  switch (error.status) {
    case 401 :
    case 404 :
      throw new Error('NOT FOUND');
    default:
      throw new Error('NOT AVAILABLE');
  }
};

const getMyBranches = () => (
  Q(ajax({
    type: 'GET',
    url: `/${Resources.myBranchListEndPoint}`,
    dataType: 'json',
  }))
    .then(branchAdapter.parseBranches)
    .catch(handleResponseError)
);

const getBranches = () => (
  Q(ajax({
    type: 'GET',
    url: `/${Resources.branchListEndPoint}`,
    dataType: 'json',
  }))
    .then(branchAdapter.parseBranches)
    .catch(handleResponseError)
);

const getBranchGroups = branchId => (
  Q(ajax({
    type: 'GET',
    url: `/${Resources.branchListEndPoint}/${branchId}/groups`,
    dataType: 'json',
  }))
    .then(groupAdapter.parseGroups)
    .catch(handleResponseError)
);

const getBranchMembers = branchId => (
  Q(ajax({
    type: 'GET',
    url: `/${Resources.branchListEndPoint}/${branchId}/members`,
    dataType: 'json',
  }))
    .then(memberAdapter.parseMembers)
    .catch(handleResponseError)
);

const getBranchAdmins = branchId => (
  Q(ajax({
    type: 'GET',
    url: `/${Resources.branchListEndPoint}/${branchId}/admins`,
    dataType: 'json',
  }))
    .then(adminAdapter.parseAdmins)
    .catch(handleResponseError)
);

export default {
  getBranches,
  getMyBranches,
  getBranchGroups,
  getBranchMembers,
  getBranchAdmins,
};
