'use strict';

const moment = require('moment');
const Q = require('q');
const $ = require('jquery');

const handleResponseError = function(error) {

 switch(error.status) {
    case 401 : case 404 : throw new Error('NOT FOUND');
    default: throw new Error('NOT AVAILABLE');
  }

};

function adaptMember(member) {
    let adapted = {
        id: member.id,
        contactFirstName: member.contactFirstName,
        contactLastName: member.contactLastName,
        schoolType: member.schoolType,
        branch: member.branch.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        dateOfBirth: moment(member.dateOfBirth).format('DD/MM/YYYY'),
        primaryPhoneNumber: member.primaryPhoneNumber,
        secondaryPhoneNumber: member.secondaryPhoneNumber,
        gender: member.gender,
        membershipType: member.membershipType,
        groups: member.groups
    };

    if (member.residentialAddress) {
        adapted.residentialAddress = {
            address: member.address,
            suburb: member.suburb,
            country: member.country,
            state: member.state,
            postcode: member.postcode
        };
    }

    if (member.postalAddress) {
        adapted.postalAddress = {
            address: member.address,
            suburb: member.suburb,
            country: member.country,
            state: member.state,
            postcode: member.postcode
        };
    }

    return adapted;
}

const update = function (member, branchId) {
    return Q($.ajax({
          type: 'PUT',
          url: `/branches/${branchId}/members/${member.id}`,
          data: adaptMember(member)
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
    update: update
};
