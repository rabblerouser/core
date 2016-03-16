'use strict';
const _ = require('lodash');

const restrictedChars = '[\<\>\"\%\;\(\)\&\+]';

var hasStringValue = (string) => {
  return !!string;
};

var isValidString = (inString, pattern) => {
  pattern = pattern || new RegExp(restrictedChars);
  return !pattern.test(inString);
};

var isValidOptionalName = (name) => {
    return name !== undefined &&
           isValidString(name) &&
           name.length < 256;
};

var isValidName = (name) => {
  return hasStringValue(name) &&
         isValidOptionalName(name);
};

var isValidId = (id) => {
    return hasStringValue(id);
};

const labFieldsChecks =
{
    name: isValidName
};

var isValidDetails = (lab) => {
    return _.reduce(labFieldsChecks, function(errors, checkFn, labFieldKey) {
        if (!lab || !checkFn(lab[labFieldKey])){
            errors.push(labFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (lab) => {
    var errors = [
        isValidDetails(lab)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid,
    isValidName: isValidName,
    isValidId: isValidId
};
