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

function isValidUUID(input) {
    return validator.isUUID(input, 4);
}

module.exports = {
    isValidString: isValidString,
    isValidName: isValidName,
    isValidOptionalName: isValidOptionalName,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidDate: isValidDate,
    isValidOptionalTextBlock: isValidOptionalTextBlock,
    isValidUUID: isValidUUID
};
