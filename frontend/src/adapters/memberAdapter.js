const mapDateOfBirth = value => `01/01/${value}`;

const mapSchoolType = (value, optional) => (value === 'Other' ? optional : value);

const prepareNewMemberPayload = fields => ({
  firstName: fields.participantName,
  lastName: fields.participantLastName,
  email: fields.contactEmail,
  primaryPhoneNumber: fields.contactNumber,
  dateOfBirth: mapDateOfBirth(fields.participantBirthYear),
  schoolType: mapSchoolType(fields.schoolType, fields.schoolTypeOtherText),
  contactFirstName: fields.contactName,
  contactLastName: fields.contactLastName,
  branchId: fields.labSelection,
  additionalInfo: fields.additionalInfo,
});

export default { prepareNewMemberPayload };
