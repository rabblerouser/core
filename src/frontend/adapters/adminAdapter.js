'use strict';
const invalidDataError = 'INVALID DATA';

let parseAdminDetails = (data) => {
    if(!data || !data.id) {
        throw(invalidDataError);
    }
    return {
        id: data.id,
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber
    };
};

let parseAdmins = (data) => {
    if(!data || !Array.isArray(data.admins)) {
        throw(invalidDataError);
    }
    return data.admins.map(parseAdminDetails);
};

export default {
    parseAdminDetails: parseAdminDetails,
    parseAdmins: parseAdmins
};
