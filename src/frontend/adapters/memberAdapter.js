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
    childName: 'firstName',
    childLastName: 'lastName',
    contactEmail: 'email',
    contactNumber: 'primaryPhoneNumber',
    childBirthYear: 'dateOfBirth',
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
    firstName: mapFirstName(fields.childName),
    lastName: mapLastName(fields.childLastName),
    email: mapEmail(fields.contactEmail),
    primaryPhoneNumber: mapPrimaryPhoneNumber(fields.contactNumber),
    dateOfBirth: mapDateOfBirth(fields.childBirthYear),
    schoolType: mapSchoolType(fields.schoolType),
    contactFirstName: mapContactFirstName(fields.contactName),
    contactLastName: mapContactLastName(fields.contactLastName),
    branch: mapBranch(fields.labSelection),
    additionalInfo: mapAdditionalInfo(fields.additionalInfo),
  };
};


export default {
    prepareNewMemberPayload: prepareNewMemberPayload
};
