'use strict';

const Q = require('q');
const $ = require('jquery');

const handleResponseError = function(error) {

 switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }

};

// createMember (take from NewMemberForm.jsx)

const updateMember = function (member, branchId) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${branchId}/members/${member.id}`,
          data: member
      }))
      .catch(handleResponseError)
      .then((data) => {
          if(data.id) {
              return data;
          }
          throw new Error('INVALID MEMBER');
      });
};

export default {
    updateMember: updateMember
};
