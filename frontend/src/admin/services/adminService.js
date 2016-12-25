import Q from 'q';
import ajax from '../../lib/ajax';
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

const adaptAdmin = admin => {
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
};

const deleteNetworkAdmin = admin => (
  Q(ajax({
    type: 'DELETE',
    url: `/admins/${admin.id}`,
  })).catch(handleResponseError)
);

const getNetworkAdmins = () => (
  Q(ajax({
    type: 'GET',
    url: `/${Resources.networkAdminEndPoint}`,
    dataType: 'json',
  }))
    .then(data => data.admins)
    .catch(handleResponseError)
);

const createNetworkAdmin = admin => (
  Q(ajax({
    type: 'POST',
    url: '/admins',
    data: adaptAdmin(admin),
  }))
    .catch(handleResponseError)
);

const updateNetworkAdmin = admin => (
  Q(ajax({
    type: 'PUT',
    url: `/admins/${admin.id}`,
    data: adaptAdmin(admin),
  }))
    .catch(handleResponseError)
);

export default {
  logout,
  getNetworkAdmins,
  createNetworkAdmin,
  updateNetworkAdmin,
  deleteNetworkAdmin,
};
