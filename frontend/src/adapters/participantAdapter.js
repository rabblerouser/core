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

const parseParticipantDetails = data => {
  if (!data) {
    throw invalidDataError;
  }
  return {
    id: data.id,
    participantName: data.firstName,
    participantLastName: data.lastName,
    contactName: data.contactFirstName,
    contactLastName: data.contactLastName,
    contactNumber: data.primaryPhoneNumber,
    contactEmail: data.email,
    participantBirthYear: parseYear(data.dateOfBirth),
    schoolType: data.schoolType,
    memberSince: data.memberSince,
    additionalInfo: data.additionalInfo,
    groups: parseGroups(data.groups),
    pastoralNotes: data.pastoralNotes,
    branchId: data.branchId,
  };
};

const parseParticipants = data => {
  if (!data || !Array.isArray(data.members)) {
    throw invalidDataError;
  }
  return data.members.map(parseParticipantDetails);
};

export default {
  parseParticipant: parseParticipantDetails,
  parseParticipants,
};
