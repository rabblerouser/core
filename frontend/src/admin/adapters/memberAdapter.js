const invalidDataError = 'INVALID DATA';

const parseGroups = value => {
  if (!value || !Array.isArray(value)) {
    throw invalidDataError;
  }
  return value;
};

const parsePostalAddress = postalAddress => {
  if (!postalAddress) {
    return null;
  }
  return {
    address: postalAddress.address,
    suburb: postalAddress.suburb,
    state: postalAddress.state,
    postcode: postalAddress.postcode,
    country: postalAddress.country,
  };
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
    postalAddress: parsePostalAddress(data.postalAddress),
    memberSince: data.memberSince,
    additionalInfo: data.additionalInfo,
    groups: parseGroups(data.groups),
    notes: data.notes,
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
