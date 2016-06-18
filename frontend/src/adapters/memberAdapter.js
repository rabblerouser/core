import moment from 'moment';

const invalidDataError = 'INVALID DATA';

const parseYear = value => {
  const year = moment(value).year();
  if (!value || !year) {
    throw invalidDataError;
  }
  return year.toString();
};

const parseGroups = value => {
  if (!value || !Array.isArray(value)) {
    throw invalidDataError;
  }
  return value;
};

const parseMember = data => {
  if (!data) {
    throw invalidDataError;
  }
  return {
    id: data.id,
    memberName: data.firstName,
    memberLastName: data.lastName,
    contactName: data.contactFirstName,
    contactLastName: data.contactLastName,
    contactNumber: data.primaryPhoneNumber,
    contactEmail: data.email,
    memberBirthYear: parseYear(data.dateOfBirth),
    schoolType: data.schoolType,
    memberSince: data.memberSince,
    additionalInfo: data.additionalInfo,
    groups: parseGroups(data.groups),
    pastoralNotes: data.pastoralNotes,
    branchId: data.branchId,
  };
};

const parseMembers = data => {
  if (!data || !Array.isArray(data.members)) {
    throw invalidDataError;
  }
  return data.members.map(parseMember);
};

const mapDateOfBirth = value => `01/01/${value}`;

const mapSchoolType = (value, optional) => (value === 'Other' ? optional : value);

const prepareNewMemberPayload = fields => ({
  firstName: fields.memberName,
  lastName: fields.memberLastName,
  email: fields.contactEmail,
  primaryPhoneNumber: fields.contactNumber,
  dateOfBirth: mapDateOfBirth(fields.memberBirthYear),
  schoolType: mapSchoolType(fields.schoolType, fields.schoolTypeOtherText),
  contactFirstName: fields.contactName,
  contactLastName: fields.contactLastName,
  branchId: fields.branchSelection,
  additionalInfo: fields.additionalInfo,
});

export default {
  prepareNewMemberPayload,
  parseMember,
  parseMembers,
};
