'use strict';
import Q from 'q';
import $ from 'jquery';
import groupAdapter from '../adapters/groupAdapter.js';

const handleResponseError = function(error) {
 switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
};

const createGroup = function (group, labId) {
    return Q($.ajax({
          type: 'POST',
          url: `/branches/${labId}/groups`,
          data: group,
      }))
      .then(groupAdapter.parseGroup)
      .catch(handleResponseError);
};

const updateGroup = function (group, labId) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${labId}/groups/${group.id}`,
          data: group,
      }))
      .then(groupAdapter.parseGroup)
      .catch(handleResponseError);
};

const deleteGroup = (group, labId) => {
    return Q($.ajax({
          type: 'DELETE',
          url: `/branches/${labId}/groups/${group.id}`
      }))
      .catch(handleResponseError);
};

export default {
    createGroup: createGroup,
    updateGroup: updateGroup,
    deleteGroup: deleteGroup
};
