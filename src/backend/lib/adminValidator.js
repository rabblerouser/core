'use strict';

let inputValidator = require('./inputValidator');
const _ = require('lodash');

var isValidBranch = (name) => {
    return inputValidator.isValidString(name, new RegExp('[\<\>\"\%\;\&\+]')) &&
           name.length < 256;
};

const adminFieldsChecks =
{
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone,
    password: inputValidator.isValidName,
    branchId: isValidBranch
};

var isValidDetails = (admin) => {
    return _.reduce(adminFieldsChecks, function(errors, checkFn, adminFieldKey) {
        if (!admin || !checkFn(admin[adminFieldKey])){
            errors.push(adminFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (admin) => {
    var errors = [
        isValidDetails(admin)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid,
};
