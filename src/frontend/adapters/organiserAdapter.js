'use strict';
const invalidDataError = 'INVALID DATA';

let parseOrganiserDetails = (data) => {
    if(!data) {
        throw(invalidDataError);
    }
    return {
        id: data.id,
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber
    };
};

let parseOrganisers = (data) => {
    if(!data || !Array.isArray(data.admins)) {
        throw(invalidDataError);
    }
    return data.admins.map(parseOrganiserDetails);
};

export default {
    parseOrganiserDetails: parseOrganiserDetails,
    parseOrganisers: parseOrganisers
};
