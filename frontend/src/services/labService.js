import Q from 'q';
import $ from 'jquery';
import { Resources } from '../config/strings';
import groupAdapter from '../adapters/groupAdapter.js';
import labAdapter from '../adapters/labAdapter.js';
import participantAdapter from '../adapters/participantAdapter.js';
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

const adaptLab = lab => ({
  id: lab.id,
  name: lab.name,
  contact: lab.contact,
  notes: lab.notes,
});

const getMyLabs = () => (
  Q($.ajax({
    type: 'GET',
    url: `/${Resources.myLabListEndPoint}`,
    dataType: 'json',
  }))
    .then(labAdapter.parseLabs)
    .catch(handleResponseError)
);

const getLabList = () => (
  Q($.ajax({
    type: 'GET',
    url: `/${Resources.labListEndPoint}`,
    dataType: 'json',
  }))
    .then(labAdapter.parseLabs)
    .catch(handleResponseError)
);

const getLabGroups = lab => (
  Q($.ajax({
    type: 'GET',
    url: `/${Resources.labListEndPoint}/${lab}/groups`,
    dataType: 'json',
  }))
    .then(groupAdapter.parseGroups)
    .catch(handleResponseError)
);

const getLabParticipants = lab => (
  Q($.ajax({
    type: 'GET',
    url: `/${Resources.labListEndPoint}/${lab}/members`,
    dataType: 'json',
  }))
    .then(participantAdapter.parseParticipants)
    .catch(handleResponseError)
);

const getOrganisers = lab => (
  Q($.ajax({
    type: 'GET',
    url: `/${Resources.labListEndPoint}/${lab}/admins`,
    dataType: 'json',
  }))
    .then(adminAdapter.parseAdmins)
    .catch(handleResponseError)
);

const deleteLab = lab => (
  Q($.ajax({
    type: 'DELETE',
    url: `/branches/${lab.id}/`,
  }))
    .catch(handleResponseError)
);

const create = lab => (
  Q($.ajax({
    type: 'POST',
    url: '/branches/',
    data: adaptLab(lab),
  }))
    .then(labAdapter.parseLab)
    .catch(handleResponseError)
);

const update = lab => (
  Q($.ajax({
    type: 'PUT',
    url: `/branches/${lab.id}/`,
    data: adaptLab(lab),
  }))
    .then(labAdapter.parseLab)
    .catch(handleResponseError)
);


export default {
  create,
  update,
  delete: deleteLab,
  getLabList,
  getMyLabs,
  getLabGroups,
  getLabParticipants,
  getOrganisers,
};
