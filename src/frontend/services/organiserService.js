'use strict';
import Q from 'q';
import $ from 'jquery';
import organiserAdapter from '../adapters/organiserAdapter.js';


const handleResponseError = function(error) {

 switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }
};

function adaptOrganiser(organiser) {
    let adapted = {
        id: organiser.id,
        name: organiser.name,
        phoneNumber: organiser.phoneNumber,
        email: organiser.email,
    };

    if(organiser.password) {
        adapted.password = organiser.password;
    }

    return adapted;
}

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
          data: adaptOrganiser(organiser)
      }))
      .then(organiserAdapter.parseOrganiserDetails)
      .catch(handleResponseError);
};

const update = function (organiser, labId) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${labId}/admins/${organiser.id}`,
          data: adaptOrganiser(organiser)
      }))
      .then(organiserAdapter.parseOrganiserDetails)
      .catch(handleResponseError);
};

export default {
    update: update,
    create: create,
    delete: deleteOrganiser
};
