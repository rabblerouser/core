'use strict';
let mapDateOfBirth = (value) => {
  return `01/01/${value}`;
};

let prepareNewMemberPayload = (fields) => {
  return {
    firstName: fields.participantName,
    lastName: fields.participantLastName,
    email: fields.contactEmail,
    primaryPhoneNumber: fields.contactNumber,
    dateOfBirth: mapDateOfBirth(fields.participantBirthYear),
    schoolType: fields.schoolType,
    contactFirstName: fields.contactName,
    contactLastName: fields.contactLastName,
    branchId: fields.labSelection,
    additionalInfo: fields.additionalInfo
  };
};

export default {
    prepareNewMemberPayload: prepareNewMemberPayload
};
