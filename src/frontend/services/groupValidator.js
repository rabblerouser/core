'use strict';
const _ = require('lodash');

var hasStringValue = (string) => {
  return !!string;
};

var isValidName = (name) => {
  return hasStringValue(name) &&
  name.length < 256;
};

var isValidId = (id) => {
    return hasStringValue(id);
};

var isValidDescription = (block) => {
    return hasStringValue(block) &&
           block.length < 2000;
};

const groupFieldsChecks =
{
    name: isValidName,
    description: isValidDescription
};

var isValidDetails = (group) => {
    return _.reduce(groupFieldsChecks, function(errors, checkFn, groupFieldKey) {
        if (!group || !checkFn(group[groupFieldKey])){
            errors.push(groupFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (group) => {
    var errors = [
        isValidDetails(group)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid,
    isValidName: isValidName,
    isValidDescription: isValidDescription,
    isValidId: isValidId
};
