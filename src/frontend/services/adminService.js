'use strict';
import Q from 'q';
import $ from 'jquery';
import adminAdapter from '../adapters/adminAdapter.js';
import { Resources } from '../config/strings';

const handleResponseError = function(error) {

 switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
};

const logout = function () {
    window.location.href = '/logout';
};

function adaptAdmin(admin) {
    let adapted = {
        id: admin.id,
        name: admin.name,
        phoneNumber: admin.phoneNumber,
        email: admin.email,
    };

    if(admin.password) {
        adapted.password = admin.password;
    }

    return adapted;
}

const deleteNetworkAdmin = (admin) => {
    return Q($.ajax({
          type: 'DELETE',
          url: `/admins/${admin.id}`
      }))
      .catch(handleResponseError);
};

const getNetworkAdmins = () => {
  return Q($.ajax({
        type: 'GET',
        url: `/${Resources.networkAdminEndPoint}`,
        dataType: 'json',
    }))
    .then(adminAdapter.parseAdmins)
    .catch(handleResponseError);
};

const createNetworkAdmin = (admin) => {
    return Q($.ajax({
          type: 'POST',
          url: `/admins`,
          data: adaptAdmin(admin)
      }))
      .then(adminAdapter.parseAdminDetails)
      .catch(handleResponseError);
};

const updateNetworkAdmin = function (admin) {
    return Q($.ajax({
          type: 'PUT',
          url: `/admins/${admin.id}`,
          data: adaptAdmin(admin)
      }))
      .then(adminAdapter.parseAdminDetails)
      .catch(handleResponseError);
};

const deleteOrganiser = (organiser, labId) => {
    return Q($.ajax({
          type: 'DELETE',
          url: `/branches/${labId}/admins/${organiser.id}`
      }))
      .catch(handleResponseError);
};

const create = function (organiser, labId) {
    return Q($.ajax({
          type: 'POST',
          url: `/branches/${labId}/admins`,
          data: adaptAdmin(organiser)
      }))
      .then(adminAdapter.parseAdminDetails)
      .catch(handleResponseError);
};

const update = function (organiser, labId) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${labId}/admins/${organiser.id}`,
          data: adaptAdmin(organiser)
      }))
      .then(adminAdapter.parseAdminDetails)
      .catch(handleResponseError);
};

export default {
    logout: logout,
    update: update,
    create: create,
    delete: deleteOrganiser,
    getNetworkAdmins: getNetworkAdmins,
    createNetworkAdmin: createNetworkAdmin,
    updateNetworkAdmin: updateNetworkAdmin,
    deleteNetworkAdmin: deleteNetworkAdmin
};
