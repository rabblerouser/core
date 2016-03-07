'use strict';

let inputValidator = require('./inputValidator');
const _ = require('lodash');

var isValidBranch = (name) => {
    return inputValidator.isValidString(name, new RegExp('[\<\>\"\%\;\&\+]')) &&
           name.length < 256;
};

const memberFieldsChecks =
{
    contactFirstName: inputValidator.isValidName,
    contactLastName: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    primaryPhoneNumber: inputValidator.isValidPhone,
    firstName: inputValidator.isValidName,
    dateOfBirth: inputValidator.isValidDate,
    branch: isValidBranch,
    schoolType: inputValidator.isValidString,
    additionalInfo: inputValidator.isValidOptionalTextBlock
};

var isValidDetails = (member) => {
    return _.reduce(memberFieldsChecks, function(errors, checkFn, memberFieldKey) {
        if (!member || !checkFn(member[memberFieldKey])){
            errors.push(memberFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (member) => {
    var errors = [
        isValidDetails(member)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid,
};
