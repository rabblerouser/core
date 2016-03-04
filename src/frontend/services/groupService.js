'use strict';

const Q = require('q');
const $ = require('jquery');
import { Resources } from '../config/strings';

const handleResponseError = function(error) {

/*  switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
  */
};

const createGroup = function (group) {    console.log('adding', group);
    return Q($.ajax({
          type: 'POST',
          url: `endpointPlaceholder`,
          data: group,
      }))
      .catch(handleResponseError)
      .then(() => {
          return group;
      });
};
const updateGroup = function (group) {
    return Q($.ajax({
          type: 'POST',
          url: `endpointPlaceholder`,
          data: group,
      }))
      .catch(handleResponseError)
      .then(() => {
          return group;
      });
};

const createOrUpdateGroup = function (group) {
     if (group.id) {
        return createGroup(group);
        }
    return updateGroup(group);
};

export default {
    createOrUpdateGroup: createOrUpdateGroup
};
