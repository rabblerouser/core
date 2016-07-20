import moment from 'moment';
import Q from 'q';
import ajax from './ajax';
import memberAdapter from '../adapters/memberAdapter.js';

const handleResponseError = error => {
  switch (error.status) {
    case 401 :
    case 404 :
      throw new Error('NOT FOUND');
    default:
      throw new Error('NOT AVAILABLE');
  }
};

const adaptMember = member => {
  const adapted = {
    id: member.id,
    branchId: member.branchId,
    firstName: member.memberName,
    lastName: member.memberLastName,
    email: member.contactEmail,
    dateOfBirth: moment(member.memberBirthYear).format('DD/MM/YYYY'),
    primaryPhoneNumber: member.contactNumber,
    secondaryPhoneNumber: member.secondaryPhoneNumber,
    gender: member.gender,
    membershipType: member.membershipType,
    pastoralNotes: member.pastoralNotes,
    additionalInfo: member.additionalInfo,
    groups: member.groups,
  };

  if (member.residentialAddress) {
    adapted.residentialAddress = {
      address: member.address,
      suburb: member.suburb,
      country: member.country,
      state: member.state,
      postcode: member.postcode,
    };
  }

  if (member.postalAddress) {
    adapted.postalAddress = {
      address: member.address,
      suburb: member.suburb,
      country: member.country,
      state: member.state,
      postcode: member.postcode,
    };
  }

  return adapted;
};

const update = (member, branchId) => (
  Q(ajax({
    type: 'PUT',
    url: `/branches/${branchId}/members/${member.id}`,
    data: adaptMember(member),
  }))
    .catch(handleResponseError)
    .then(memberAdapter.parseMember)
);

export default { update };
