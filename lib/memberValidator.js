'use strict';
const validator = require('validator');
const moment = require('moment');
const _ = require('lodash');

function isValidVerificationHash(theHash) {
  return validator.isUUID(theHash, '4');
}

var containsSpecialCharacters = (theString) => {
    return /[\<\>\"\%\;\(\)\&\+]/.test(theString);
};

var isValidString = (theString) => {
    return !!theString &&
        !containsSpecialCharacters(theString) &&
        theString.length < 256;
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

var isValidPhoneNumber = (input) => {
  return /[-+\s()\d]+/.test(input);
};

var isValidPhone = (phone) => {
    return (!!phone) && isValidPhoneNumber(phone);
};

var isValidOptionalPhone = (phone) => {
    return !phone || isValidPhone(phone);
};

var isValidDate = (date) => {
    let formattedDate = moment(date, 'DD/MM/YYYY', true);
    let sixteenYearsAgo = moment().endOf('day').subtract(16, 'years');
    return formattedDate.isValid() && formattedDate.isSameOrBefore(sixteenYearsAgo);
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
        });
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

var isValidCountry = (country) => {
    return isValidLength(country) && country !== 'Select Country';
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
    return validOptions.indexOf(type) !== -1;
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
    country: isValidCountry
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
    isValidDate: isValidDate,
    isValid: isValid,
    isValidAddress: isValidResidentialAddress,
    isValidMembershipType: isValidMembershipType,
    isValidVerificationHash: isValidVerificationHash
};
