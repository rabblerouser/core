'use strict';
import moment from 'moment';
const invalidDataError = 'INVALID DATA';

let parseYear = (value) => {
    let year = moment(value).year();
    if(!value || !year) {
        throw(invalidDataError);
    }
    return year.toString();
};

let parseGroups = (value) => {
    if(!value || !Array.isArray(value)) {
        throw(invalidDataError);
    }
    return value;
};

let parseParticipantDetails = (data) => {
    if(!data) {
        throw(invalidDataError);
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
        labId: data.branchId
    };
};

let parseParticipants = (data) => {
    if(!data || !Array.isArray(data.members)) {
        throw(invalidDataError);
    }
    return data.members.map(parseParticipantDetails);
};

export default {
    parseParticipant: parseParticipantDetails,
    parseParticipants: parseParticipants
};
