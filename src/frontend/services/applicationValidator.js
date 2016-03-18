'use strict';
const validator = require('validator');
const _ = require('lodash');
const isEmpty = _.isEmpty;

const restrictedChars = '[\<\>\"\%\;\(\)\&\+]';

var hasStringValue = (string) => {
  return !!string;
};

var isValidString = (inString, pattern) => {
  pattern = pattern || new RegExp(restrictedChars);
  return !pattern.test(inString);
};

var isValidPhoneNumber = (input) => {
  return /^[-+\s()\d]+$/.test(input);
};

var isValidOptionalName = (name) => {
    return isEmpty(name) ||
           (isValidString(name) &&
           name.length < 256);
};

var isValidName = (name) => {
  return hasStringValue(name) &&
         isValidOptionalName(name);
};

var isValidOptionalTextBlock = (block) => {
    return isEmpty(block) ||  block.length < 2000;
};

var isValidLab = (name) => {
  return hasStringValue(name) &&
         isValidString(name, new RegExp('[\<\>\"\%\;\&\+]'));
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isValidPhone = (phone) => {
    return (!!phone) && isValidPhoneNumber(phone);
};

var isValidYear = (number) => {
    let currentYear = new Date().getFullYear();
    let year = parseInt(number);
    return year <= currentYear && year >= 1900;
};

const applicationFieldsChecks =
{
    contactName: isValidName,
    contactLastName: isValidOptionalName,
    contactEmail: isValidEmail,
    contactNumber: isValidPhone,
    participantName: isValidName,
    participantLastName: isValidOptionalName,
    participantBirthYear:  isValidYear,
    labSelection: isValidLab,
    schoolType: isValidName,
    schoolTypeOtherText: isValidOptionalName,
    additionalInfo: isValidOptionalTextBlock
};

var isValidDetails = (application) => {
    return _.reduce(applicationFieldsChecks, function(errors, checkFn, applicationFieldKey) {
        if (!application || !checkFn(application[applicationFieldKey])){
            errors.push(applicationFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (application) => {
    var errors = [
        isValidDetails(application)
    ];
    return _.flatten(errors);
};

export default {
    isValidName: isValidName,
    isValidOptionalName: isValidOptionalName,
    isValidOptionalTextBlock: isValidOptionalTextBlock,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidYear: isValidYear,
    isValid: isValid
};
