'use strict';
const validator = require('validator');
const moment = require('moment');
const _ = require('lodash');
const isEmpty = _.isEmpty;

var containsSpecialCharacters = (theString, restricted) => {
    return restricted.test(theString);
};

var isValidString = (theString, restricted) => {
    restricted = restricted || new RegExp('[\<\>\"\%\;\(\)\&\+]');
    return !!theString &&
        !containsSpecialCharacters(theString, restricted);
};

var isValidOptionalName = (name) => {
    return isEmpty(name) ||
           (isValidString(name) &&
           name.length < 256);
};

var isValidName = (name) => {
    return isValidString(name)  &&
           name.length < 256;
};

var isValidOptionalTextBlock = (block) => {
    return isEmpty(block) ||  block.length < 2000;
};

var isValidBranch = (name) => {
    return isValidString(name, new RegExp('[\<\>\"\%\;\&\+]')) &&
           name.length < 256;
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isValidPhoneNumber = (input) => {
  return /^[-+\s()\d]+$/.test(input);
};

var isValidPhone = (phone) => {
    return (!!phone) && isValidPhoneNumber(phone);
};

var isValidDate = (date) => {
    let formattedDate = moment(date, 'DD/MM/YYYY', true);
    return formattedDate.isValid() && formattedDate.isSameOrBefore(moment());
};

const memberFieldsChecks =
{
    contactFirstName: isValidName,
    contactLastName: isValidOptionalName,
    email: isValidEmail,
    primaryPhoneNumber: isValidPhone,
    firstName: isValidName,
    dateOfBirth: isValidDate,
    branch: isValidBranch,
    schoolType: isValidString,
    additionalInfo: isValidOptionalTextBlock
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
    isValidOptionalName: isValidOptionalName,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidDate: isValidDate,
    isValid: isValid,
    isValidOptionalTextBlock: isValidOptionalTextBlock
};
