'use strict';
let mapDateOfBirth = (value) => {
  return `01/01/${value}`;
};

let mapSchoolType = (value, optional) => {
    return value === 'Other' ? optional : value;
};

let prepareNewMemberPayload = (fields) => {
  return {
    firstName: fields.participantName,
    lastName: fields.participantLastName,
    email: fields.contactEmail,
    primaryPhoneNumber: fields.contactNumber,
    dateOfBirth: mapDateOfBirth(fields.participantBirthYear),
    schoolType: mapSchoolType(fields.schoolType, fields.schoolTypeOtherText),
    contactFirstName: fields.contactName,
    contactLastName: fields.contactLastName,
    branchId: fields.labSelection,
    additionalInfo: fields.additionalInfo
  };
};

export default {
    prepareNewMemberPayload: prepareNewMemberPayload
};
