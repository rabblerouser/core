'use strict';
import moment from 'moment';
const invalidDataError = 'INVALID DATA';

let parseString = (value) => {
    if(value === undefined) {
        throw(invalidDataError);
    }
    return value;
};

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
        id: parseString(data.id),
        participantName: parseString(data.firstName),
        participantLastName: parseString(data.lastName),
        contactName: parseString(data.contactFirstName),
        contactLastName: parseString(data.contactLastName),
        contactNumber: parseString(data.primaryPhoneNumber),
        contactEmail: parseString(data.email),
        participantBirthYear: parseYear(data.dateOfBirth),
        schoolType: parseString(data.schoolType),
        memberSince: parseString(data.memberSince),
        additionalInfo: parseString(data.additionalInfo),
        groups: parseGroups(data.groups),
        branchId: parseString(data.branchId)
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
