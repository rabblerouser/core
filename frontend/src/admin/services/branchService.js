import Q from 'q';
import ajax from '../../lib/ajax';
import { Resources } from '../config/strings';
import groupAdapter from '../adapters/groupAdapter.js';
import branchAdapter from '../adapters/branchAdapter.js';

const handleResponseError = error => {
  switch (error.status) {
    case 401 :
    case 404 :
      throw new Error('NOT FOUND');
    default:
      throw new Error('NOT AVAILABLE');
  }
};

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
    .then(data => data.members)
    .catch(handleResponseError)
);

export default {
  getBranches,
  getBranchGroups,
  getBranchMembers,
};
