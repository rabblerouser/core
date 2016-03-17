'use strict';

let fieldsHaveAllKeys = (mapKeys, fields) => {
  return mapKeys.reduce((hasAllKeys, key) => {
              return hasAllKeys && (key in fields);
            }, true);
};

let mapFirstName = (value) => {
  return value;
};

let mapLastName = (value) => {
  return value;
};

let mapEmail = (value) => {
  return value;
};

let mapPrimaryPhoneNumber = (value) => {
  return value;
};

let mapDateOfBirth = (value) => {
  return `01/01/${value}`;
};

let mapSchoolType = (value) => {
  return value;
};

let mapContactFirstName = (value) => {
  return value;
};

let mapContactLastName = (value) => {
  return value;
};

let mapBranch = (value) => {
  return value;
};

let mapAdditionalInfo = (value) => {
  return value;
};


let prepareNewMemberPayload = (fields) => {

  let map = {
    participantName: 'firstName',
    participantLastName: 'lastName',
    contactEmail: 'email',
    contactNumber: 'primaryPhoneNumber',
    participantBirthYear: 'dateOfBirth',
    schoolType: 'schoolType',
    contactName: 'contactFirstName',
    contactLastName : 'contactLastName',
    labSelection : 'branch',
    additionalInfo: 'additionalInfo'
  };

  if (!fieldsHaveAllKeys(Object.keys(map), fields)) {
    return {};
  }

  return {
    firstName: mapFirstName(fields.participantName),
    lastName: mapLastName(fields.participantLastName),
    email: mapEmail(fields.contactEmail),
    primaryPhoneNumber: mapPrimaryPhoneNumber(fields.contactNumber),
    dateOfBirth: mapDateOfBirth(fields.participantBirthYear),
    schoolType: mapSchoolType(fields.schoolType),
    contactFirstName: mapContactFirstName(fields.contactName),
    contactLastName: mapContactLastName(fields.contactLastName),
    branchId: mapBranch(fields.labSelection),
    additionalInfo: mapAdditionalInfo(fields.additionalInfo)
  };
};


export default {
    prepareNewMemberPayload: prepareNewMemberPayload
};
