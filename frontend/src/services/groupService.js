import Q from 'q';
import ajax from './ajax';
import groupAdapter from '../adapters/groupAdapter.js';

const handleResponseError = error => {
  switch (error.status) {
    case 401 :
    case 404 :
      throw new Error('NOT FOUND');
    default:
      throw new Error('NOT AVAILABLE');
  }
};

const createGroup = (group, branchId) => (
  Q(ajax({
    type: 'POST',
    url: `/branches/${branchId}/groups`,
    data: group,
  }))
    .then(groupAdapter.parseGroup)
    .catch(handleResponseError)
);

const updateGroup = (group, branchId) => (
  Q(ajax({
    type: 'PUT',
    url: `/branches/${branchId}/groups/${group.id}`,
    data: group,
  }))
    .then(groupAdapter.parseGroup)
    .catch(handleResponseError)
);

const deleteGroup = (group, branchId) => (
  Q(ajax({
    type: 'DELETE',
    url: `/branches/${branchId}/groups/${group.id}`,
  }))
    .catch(handleResponseError)
);

export default {
  createGroup,
  updateGroup,
  deleteGroup,
};
