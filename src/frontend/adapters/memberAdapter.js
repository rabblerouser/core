'use strict';

let fieldsHaveAllKeys = (mapKeys, fields) => {
  mapKeys.reduce((hasAllKeys, key) => {
              return hasAllKeys && (key in fields);
            }, true);
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

  let payload = {};

  if (!fieldsHaveAllKeys) {
    return payload;
  }

  Object.keys(map)
      .forEach( (key) => {
        payload[map[key]] = fields[key];
      });

  return payload;
};

export default {
    prepareNewMemberPayload: prepareNewMemberPayload
};
