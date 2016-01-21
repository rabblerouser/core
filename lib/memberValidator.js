'use strict';
const validator = require('validator');
const moment = require('moment');
const _ = require('lodash');

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

var isValidAddress = (addressObj) => {
    var genericAddressFields = _.omit(addressObj, ["state", "postcode"]);
    return !!addressObj
        && _.reduce(_.values(genericAddressFields), function(result, val) { return result && isValidLength(val);}, true)
        && isValidLength(addressObj.state)
        && isValidPostcode(addressObj.postcode);
};

var isValidLength = (object, minLength, maxLength) => {
    minLength = minLength ? minLength : 1;
    maxLength = maxLength ? maxLength : 255;
    return !!object && object.length <= maxLength && object.length >= minLength;
};

var isValidMembershipType = (type) => {
    let validOptions = ['full', 'permanentResident', 'supporter', 'internationalSupporter'];
    return validOptions.indexOf(type) != -1;
}

const memberFieldsChecks =
{
    firstName: isValidName,
    lastName: isValidName,
    gender: isValidGender,
    email: isValidEmail,
    primaryPhoneNumber: isValidPhone,
    secondaryPhoneNumber: isValidOptionalPhone,
    dateOfBirth:  isValidDate,
    residentialAddress: isValidAddress,
    postalAddress: isValidAddress,
    membershipType: isValidMembershipType
};

var isValid = (member) => {
    return _.reduce(memberFieldsChecks, function(errors, checkFn, memberFieldKey) {
            if (!member || !checkFn(member[memberFieldKey])){
                errors.push(memberFieldKey);
            }
        return errors;
    }, []);
};

module.exports = {
    isValidName: isValidName,
    isValidGender: isValidGender,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidOptionalPhone: isValidOptionalPhone,
    isValidDate: isValidDate,
    isValidAddress: isValidAddress,
    isValid: isValid,
    isValidMembershipType: isValidMembershipType
};
