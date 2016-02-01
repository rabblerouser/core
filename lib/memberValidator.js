'use strict';
const validator = require('validator');
const moment = require('moment');
const _ = require('lodash');
const addressValidator = require('./addressValidator.js');

function isValidVerificationHash(theHash) {
  return validator.isHexadecimal(theHash);
}

var containsSpecialCharacters = (theString) => {
    return /[\<\>\"\%\;\(\)\&\+]/.test(theString);
};

var isValidString = (theString) => {
    return !!theString
        && !containsSpecialCharacters(theString)
        && theString.length < 256
};

var isValidName = (name) => {
    return isValidString(name);
};

var isValidGender = (gender) => {
    return !gender || isValidString(gender);
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isPhoneNumber = (input) => {
    return /^(\+61|0)[0-9]{9}$/.test(input);
};

var isValidPhone = (phone) => {
    return (!!phone) && isPhoneNumber(phone);
};

var isValidOptionalPhone = (phone) => {
    return !phone || isPhoneNumber(phone);
};

var isValidDate = (date) => {
    let formattedDate = moment(date, "DD/MM/YYYY", true);
    return formattedDate.isValid()
        && formattedDate.isBefore(moment());
};

var isValidPostcode = (postcode) => {
    return !!postcode && /^\d{4}$/.test(postcode);
};

var isValidInternationalPostcode = (postcode) => {
    return !!postcode && postcode.toString().length <= 16;
};

function setUpPostCodeChecks(addressObj) {
    if (addressObj && addressObj.country !== 'Australia') {
        addressFieldChecks.postcode = isValidInternationalPostcode;
    } else {
        addressFieldChecks.postcode = isValidPostcode;
    }
}

var isValidResidentialAddress = (addressObj) => {
    setUpPostCodeChecks(addressObj);
    var addressErrors =  _.reduce(addressFieldChecks, function(errors, checkFn, memberFieldKey) {
        if (!addressObj || !checkFn(addressObj[memberFieldKey])){
            errors.push(memberFieldKey);
        }
        return errors;
    },[]);

    if(addressErrors.length > 0){
        return _.map(addressErrors, function(error){
            return 'residential' + _.capitalize(error);
        })
    }
    return [];
};

var isValidPostalAddress = (addressObj) => {
    setUpPostCodeChecks(addressObj);
    var addressErrors =  _.reduce(addressFieldChecks, function(errors, checkFn, memberFieldKey) {
        if (!addressObj || !checkFn(addressObj[memberFieldKey])){
            errors.push(memberFieldKey);
        }
        return errors;
    },[]);

    if(addressErrors.length > 0){
        return _.map(addressErrors, function(error){
            return 'postal' + _.capitalize(error);
        });
    }
    return [];
};

var isValidLength = (object, minLength, maxLength) => {
    minLength = minLength ? minLength : 1;
    maxLength = maxLength ? maxLength : 255;
    return !!object && object.length <= maxLength && object.length >= minLength;
};

var isValidDetails = (member) => {
    return _.reduce(memberFieldsChecks, function(errors, checkFn, memberFieldKey) {
        if (!member || !checkFn(member[memberFieldKey])){
            errors.push(memberFieldKey);
        }
        return errors;
    },[]);
};

var isValidMembershipType = (type) => {
    let validOptions = ['full', 'permanentResident', 'supporter', 'internationalSupporter'];
    return validOptions.indexOf(type) != -1;
};

const memberFieldsChecks =
{
    firstName: isValidName,
    lastName: isValidName,
    gender: isValidGender,
    email: isValidEmail,
    primaryPhoneNumber: isValidPhone,
    secondaryPhoneNumber: isValidOptionalPhone,
    dateOfBirth:  isValidDate
};

var addressFieldChecks =
{
    address: isValidLength,
    suburb: isValidLength,
    postcode: isValidPostcode,
    state: isValidLength,
    country: isValidLength
};

var isValid = (member) => {
    var errors = [
        isValidDetails(member),
        isValidResidentialAddress(member && member['residentialAddress']),
        isValidPostalAddress(member && member['postalAddress'])
    ];
    return _.flatten(errors);

};

module.exports = {
    isValidName: isValidName,
    isValidGender: isValidGender,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidOptionalPhone: isValidOptionalPhone,
    isValidDate: isValidDate,
    isValid: isValid,
    isValidAddress: isValidResidentialAddress,
    isValidMembershipType: isValidMembershipType,
    isValidVerificationHash: isValidVerificationHash
};