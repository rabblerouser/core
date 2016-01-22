'use strict';
const validator = require('validator');
const _ = require('lodash');

var isValidPostcode = (postcode) => {
    return !!postcode && /^\d{4}$/.test(postcode);
};

var isValidLength = (object, minLength, maxLength) => {
    minLength = minLength ? minLength : 1;
    maxLength = maxLength ? maxLength : 255;
    return !!object && object.length <= maxLength && object.length >= minLength;
};

const memberFieldsChecks =
{
    address: isValidLength,
    suburb: isValidLength,
    state: isValidLength,
    country: isValidLength,
    postcode: isValidPostcode
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
    isValid: isValid
};