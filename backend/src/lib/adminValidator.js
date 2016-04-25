'use strict';

let inputValidator = require('./inputValidator');
const _ = require('lodash');

var isValidBranch = (name) => {
    return inputValidator.isValidString(name, new RegExp('[\<\>\"\%\;\&\+]')) &&
           name.length < 256;
};

const superAdminPasswordRequired =
{
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone,
    password: inputValidator.isValidPassword
};

const noPasswordRequired =
{
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone,
    branchId: isValidBranch
};

const superAdminNoPasswordRequired =
{
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone
};
const passwordRequired = {
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone,
    branchId: isValidBranch,
    password: inputValidator.isValidPassword
};

var isValidDetails = (admin, fieldsChecks) => {
    return _.reduce(fieldsChecks, function(errors, checkFn, adminFieldKey) {
        if (!admin || !checkFn(admin[adminFieldKey])){
            errors.push(adminFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (admin) => {
    var errors = [
        isValidDetails(admin, passwordRequired)
    ];
    return _.flatten(errors);
};

var isValidWithoutPassword = (admin) => {
    var errors = [
        isValidDetails(admin, noPasswordRequired)
    ];
    return _.flatten(errors);
};

var isSuperAdminValidWithoutPassword = (admin) => {
    var errors = [
        isValidDetails(admin, superAdminNoPasswordRequired)
    ];
    return _.flatten(errors);
};

var isSuperAdminValid = (admin) => {
    var errors = [
        isValidDetails(admin, superAdminPasswordRequired)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid,
    isValidWithoutPassword: isValidWithoutPassword,
    isSuperAdminValid: isSuperAdminValid,
    isSuperAdminValidWithoutPassword: isSuperAdminValidWithoutPassword,
};
