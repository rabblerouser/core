'use strict';
const invalidDataError = 'INVALID DATA';

let parseString = (value) => {
    if(!value) {
        throw(invalidDataError);
    }
    return value;
};

let parseLabDetails = (data) => {
    if(!data) {
        throw(invalidDataError);
    }
    return {
        id: parseString(data.id),
        name: parseString(data.name),
        notes: data.notes,
        contact: data.contact
    };
};

let parseLabs = (data) => {
    if(!data || !Array.isArray(data.branches)) {
        throw(invalidDataError);
    }
    return data.branches.map(parseLabDetails);
};

export default {
    parseLab: parseLabDetails,
    parseLabs: parseLabs
};
