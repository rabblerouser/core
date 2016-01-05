'use strict';
const validator = require('validator');
const moment = require('moment');

var isValidName = (name) => {

    return !!name
           && !/[\<\>\"\%\;\(\)\&\+]/.test(name)
           && name.length < 256;
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isValidPhone = (phone) => {
    return !!phone && /^(\+61|0)[0-9]{9}$/.test(phone);
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
    && isValidEmail(member.email)
    && isValidPhone(member.phoneNumber)
    && isValidDate(member.dateOfBirth)
    && isValidAddress(member.residentialAddress)
    && isValidAddress(member.postalAddress)
};

module.exports = {
    isValidName: isValidName,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidDate: isValidDate,
    isValidAddress: isValidAddress,
    isValid: isValid
};