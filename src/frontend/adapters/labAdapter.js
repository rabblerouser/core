'use strict';
import LabValidator from '../services/labValidator.js';
const invalidDataError = 'INVALID DATA';

let parseId = (id) => {
    if(!LabValidator.isValidId(id)) {
        throw(invalidDataError);
    }
    return id;
};

let parseName = (name) => {
    if(!LabValidator.isValidName(name)) {
        throw(invalidDataError);
    }
    return name;
};

let parseLabDetails = (data) => {
    if(!data) {
        throw(invalidDataError);
    }
    return {
        id: parseId(data.id),
        name: parseName(data.name)
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
