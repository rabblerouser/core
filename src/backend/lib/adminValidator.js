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
    branchId: isValidBranch
};

var isValidDetails = (admin, fields) => {
    return _.reduce(fields, function(errors, checkFn, adminFieldKey) {
        if (!admin || !checkFn(admin[adminFieldKey])){
            errors.push(adminFieldKey);
        }
        return errors;
    },[]);
};

var isBranchAdminValid = (admin) => {
    var errors = [
        isValidDetails(admin, adminFieldsChecks)
    ];
    return _.flatten(errors);
};

module.exports = {
    isBranchAdminValid: isBranchAdminValid
};
