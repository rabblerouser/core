'use strict';
import Q from 'q';
import $ from 'jquery';
import { Resources } from '../config/strings';
import groupAdapter from '../adapters/groupAdapter.js';
import labAdapter from '../adapters/labAdapter.js';
import participantAdapter from '../adapters/participantAdapter.js';


const handleResponseError = function(error) {
  switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
};

const getMyLabs = function () {
    return Q($.ajax({
          type: 'GET',
          url: `/${Resources.myLabListEndPoint}`,
          dataType: 'json',
      }))
      .then(labAdapter.parseLabs)
      .catch(handleResponseError);
};

const getLabList = function () {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}`,
        dataType: 'json',
    }))
    .then(labAdapter.parseLabs)
    .catch(handleResponseError);
};

const getLabGroups = function (lab) {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}/${lab}/groups`,
        dataType: 'json',
    }))
    .then(groupAdapter.parseGroups)
    .catch(handleResponseError);
};

const getLabParticipants = function (lab) {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.labListEndPoint}/${lab}/members`,
        dataType: 'json',
    }))
    .then(participantAdapter.parseParticipants)
    .catch(handleResponseError);
};

const getOrganisers = function (lab) {
    return Q($.ajax({
          type: 'GET',
          url: `/${Resources.labListEndPoint}/${lab}/admins`,
          dataType: 'json',
      }))
      .catch(handleResponseError);
}

export default {
    getLabList: getLabList,
    getMyLabs: getMyLabs,
    getLabGroups: getLabGroups,
    getLabParticipants: getLabParticipants,
    getOrganisers: getOrganisers
};
