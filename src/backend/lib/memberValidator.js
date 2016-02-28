'use strict';
const validator = require('validator');
const moment = require('moment');
const _ = require('lodash');

function isValidVerificationHash(theHash) {
  return validator.isUUID(theHash, '4');
}

var containsSpecialCharacters = (theString, restricted) => {
    return restricted.test(theString);
};

var isValidString = (theString, restricted) => {
    restricted = restricted || new RegExp('[\<\>\"\%\;\(\)\&\+]');
    return !!theString &&
        !containsSpecialCharacters(theString, restricted) &&
        theString.length < 256;
};

var isValidName = (name) => {
    return isValidString(name);
};

var isValidBranch = (name) => {
    return isValidString(name, new RegExp('[\<\>\"\%\;\&\+]'));
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isValidPhoneNumber = (input) => {
  return /[-+\s()\d]+/.test(input);
};

var isValidPhone = (phone) => {
    return (!!phone) && isValidPhoneNumber(phone);
};

var isValidYear = (number) => {
    let currentYear = new Date().getFullYear();
    let year = parseInt(number);
    return year <= currentYear && year >= (currentYear - 18);
};

var isValidDate = (date) => {
    let formattedDate = moment(date, 'DD/MM/YYYY', true);
    let sixteenYearsAgo = moment().endOf('day').subtract(16, 'years');
    return formattedDate.isValid() && formattedDate.isSameOrBefore(sixteenYearsAgo);
};

const memberFieldsChecks =
{
    contactFirstName: isValidName,
    email: isValidEmail,
    primaryPhoneNumber: isValidPhone,
    firstName: isValidName,
    dateOfBirth: isValidDate,
    branch: isValidBranch,
    schoolType: isValidString
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
    isValidName: isValidName,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidDate: isValidDate,
    isValidYear: isValidYear,
    isValid: isValid,
    isValidVerificationHash: isValidVerificationHash
};

