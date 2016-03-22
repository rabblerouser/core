'use strict';
import Q from 'q';
import $ from 'jquery';
import { Resources } from '../config/strings';
import groupAdapter from '../adapters/groupAdapter.js';
import labAdapter from '../adapters/labAdapter.js';
import participantAdapter from '../adapters/participantAdapter.js';
import organiserAdapter from '../adapters/organiserAdapter.js';


const handleResponseError = function(error) {
  switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
};

function adaptLab(lab) {
    let adapted = {
        id: lab.id,
        name: lab.name,
        contact: lab.contact,
        notes: lab.notes
    };
    return adapted;
}

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
      .then(organiserAdapter.parseOrganisers)
      .catch(handleResponseError);
};

const deleteLab = (lab) => {
    return Q($.ajax({
          type: 'DELETE',
          url: `/branches/${lab.id}/`
      }))
      .catch(handleResponseError);
};

const create = function (lab) {
    return Q($.ajax({
          type: 'POST',
          url: `/branches/`,
          data: adaptLab(lab)
      }))
      .then(labAdapter.parseLab)
      .catch(handleResponseError);
};

const update = function (lab) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${lab.id}/`,
          data: adaptLab(lab)
      }))
      .then(labAdapter.parseLab)
      .catch(handleResponseError);
};


export default {
    create: create,
    update: update,
    delete: deleteLab,
    getLabList: getLabList,
    getMyLabs: getMyLabs,
    getLabGroups: getLabGroups,
    getLabParticipants: getLabParticipants,
    getOrganisers: getOrganisers
};
