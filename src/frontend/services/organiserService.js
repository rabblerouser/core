'use strict';

const Q = require('q');
const $ = require('jquery');

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
        password: organiser.password
    };

    return adapted;
}

const update = function (organiser, branchId) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${branchId}/admin/${organiser.id}`,
          data: adaptOrganiser(organiser)
      }))
      .catch(handleResponseError)
      .then((data) => {
          if(data.id) {
              return data;
          }
          throw new Error('INVALID ORGANISER');
      });
};

export default {
    update: update
};
