import Q from 'q';
import $ from 'jquery';
import adminAdapter from '../adapters/adminAdapter.js';
import { Resources } from '../config/strings';

const handleResponseError = error => {
  switch (error.status) {
    case 401 :
    case 404 :
      throw new Error('NOT FOUND');
    default:
      throw new Error('NOT AVAILABLE');
  }
};

const logout = () => {
  window.location.href = '/logout';
};

function adaptAdmin(admin) {
  const adapted = {
    id: admin.id,
    name: admin.name,
    phoneNumber: admin.phoneNumber,
    email: admin.email,
  };

  if (admin.password) {
    adapted.password = admin.password;
  }

  return adapted;
}

const deleteNetworkAdmin = admin => (
  Q($.ajax({
    type: 'DELETE',
    url: `/admins/${admin.id}`,
  })).catch(handleResponseError)
);

const getNetworkAdmins = () => (
  Q($.ajax({
    type: 'GET',
    url: `/${Resources.networkAdminEndPoint}`,
    dataType: 'json',
  }))
    .then(adminAdapter.parseAdmins)
    .catch(handleResponseError)
);

const createNetworkAdmin = admin => (
  Q($.ajax({
    type: 'POST',
    url: '/admins',
    data: adaptAdmin(admin),
  }))
    .then(adminAdapter.parseAdminDetails)
    .catch(handleResponseError)
);

const updateNetworkAdmin = admin => (
  Q($.ajax({
    type: 'PUT',
    url: `/admins/${admin.id}`,
    data: adaptAdmin(admin),
  }))
    .then(adminAdapter.parseAdminDetails)
    .catch(handleResponseError)
);

const deleteOrganiser = (organiser, labId) => (
  Q($.ajax({
    type: 'DELETE',
    url: `/branches/${labId}/admins/${organiser.id}`,
  }))
    .catch(handleResponseError)
);

const create = (organiser, labId) => (
  Q($.ajax({
    type: 'POST',
    url: `/branches/${labId}/admins`,
    data: adaptAdmin(organiser),
  }))
    .then(adminAdapter.parseAdminDetails)
    .catch(handleResponseError)
);

const update = (organiser, labId) => (
  Q($.ajax({
    type: 'PUT',
    url: `/branches/${labId}/admins/${organiser.id}`,
    data: adaptAdmin(organiser),
  }))
    .then(adminAdapter.parseAdminDetails)
    .catch(handleResponseError)
);

export default {
  logout,
  update,
  create,
  deleteOrganiser,
  getNetworkAdmins,
  createNetworkAdmin,
  updateNetworkAdmin,
  deleteNetworkAdmin,
};
