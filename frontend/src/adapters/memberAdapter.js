const invalidDataError = 'INVALID DATA';

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
    contactNumber: data.primaryPhoneNumber,
    contactEmail: data.email,
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

const prepareNewMemberPayload = fields => ({
  firstName: fields.memberName,
  lastName: fields.memberLastName,
  email: fields.contactEmail,
  primaryPhoneNumber: fields.contactNumber,
  branchId: fields.branchSelection,
  additionalInfo: fields.additionalInfo,
});

export default {
  prepareNewMemberPayload,
  parseMember,
  parseMembers,
};
