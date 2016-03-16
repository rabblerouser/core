'use strict';
import GroupValidator from '../services/groupValidator.js';
const invalidDataError = 'INVALID DATA';

let parseId = (id) => {
    if(!GroupValidator.isValidId(id)) {
        throw(invalidDataError);
    }
    return id;
};

let parseName = (name) => {
    if(!GroupValidator.isValidName(name)) {
        throw(invalidDataError);
    }
    return name;
};

let parseDescription = (description) => {
    if(!GroupValidator.isValidDescription(description)) {
        throw(invalidDataError);
    }
    return description;
};

let parseGroupDetails = (data) => {
    if(!data) {
        throw(invalidDataError);
    }
    return {
        id: parseId(data.id),
        name: parseName(data.name),
        description: parseDescription(data.description)
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
