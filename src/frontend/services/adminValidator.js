'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const adminFieldsChecks =
{
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone
};

const withPasswordFieldCheck = {
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidOptionalPhone,
    password: inputValidator.isValidPassword
};

var isValidDetails = (admin, checkPassword) => {
    let fieldsChecks = checkPassword ? withPasswordFieldCheck : adminFieldsChecks;
    return _.reduce(fieldsChecks, function(errors, checkFn, adminFieldKey) {
        if (!admin || !checkFn(admin[adminFieldKey])){
            errors.push(adminFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (admin) => {
    var errors = [
        isValidDetails(admin, true)
    ];
    return _.flatten(errors);
};

var isValidWithoutPassword = (admin) => {
    var errors = [
        isValidDetails(admin, false)
    ];
    return _.flatten(errors);
};

export default {
    isValid: isValid,
    isValidWithoutPassword: isValidWithoutPassword
};
