'use strict';
const invalidDataError = 'INVALID DATA';

let parseString = (value) => {
    if(!value) {
        throw(invalidDataError);
    }
    return value;
};

let parseGroupDetails = (data) => {
    if(!data) {
        throw(invalidDataError);
    }
    return {
        id: parseString(data.id),
        name: parseString(data.name),
        description: parseString(data.description)
    };
};

let parseGroups = (data) => {
    if(!data || !Array.isArray(data.groups)) {
        throw(invalidDataError);
    }
    return data.groups.map(parseGroupDetails);
};

export default {
    parseGroup: parseGroupDetails,
    parseGroups: parseGroups
};
