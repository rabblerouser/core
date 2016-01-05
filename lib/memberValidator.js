'use strict';
const validator = require('validator');
const moment = require('moment');

var isValidString = (theString) => {
    return !!theString
        && !/[\<\>\"\%\;\(\)\&\+]/.test(theString)
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

var isValidPhone = (phone) => {
    return (!!phone) && /^(\+61|0)[0-9]{9}$/.test(phone);
};

var isValidOptionalPhone = (phone) => {
    return !phone || /^(\+61|0)[0-9]{9}$/.test(phone);
};

var isValidDate = (date) => {
    let formattedDate = moment(date, "DD/MM/YYYY", true);
    return formattedDate.isValid()
        && formattedDate.isBefore(moment());
};

var isValidAddress = (addressObj) => {
    return !!addressObj
    && isValidLength(addressObj.address)
    && isValidLength(addressObj.suburb)
    && isValidLength(addressObj.state, 2, 3)
    && !! addressObj.postcode && /^\d{4}$/.test(addressObj.postcode)
    && isValidLength(addressObj.country);
};

var isValidLength = (object, minLength, maxLength) => {
    minLength = minLength ? minLength : 1;
    maxLength = maxLength ? maxLength : 255;
    return !!object && object.length <= maxLength && object.length >= minLength;
};

var isValid = (member) => {
    return !!member
        && isValidName(member.firstName)
        && isValidName(member.lastName)
        && isValidGender(member.gender)
        && isValidEmail(member.email)
        && isValidPhone(member.primaryPhoneNumber)
        && isValidOptionalPhone(member.secondaryPhoneNumber)
        && isValidDate(member.dateOfBirth)
        && isValidAddress(member.residentialAddress)
        && isValidAddress(member.postalAddress)
};

module.exports = {
    isValidName: isValidName,
    isValidGender: isValidGender,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidOptionalPhone: isValidOptionalPhone,
    isValidDate: isValidDate,
    isValidAddress: isValidAddress,
    isValid: isValid
};