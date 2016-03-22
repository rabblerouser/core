'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const organiserFieldsChecks =
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

var isValidDetails = (organiser, checkPassword) => {
    let fieldsChecks = checkPassword ? withPasswordFieldCheck : organiserFieldsChecks;
    return _.reduce(fieldsChecks, function(errors, checkFn, organiserFieldKey) {
        if (!organiser || !checkFn(organiser[organiserFieldKey])){
            errors.push(organiserFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (organiser) => {
    var errors = [
        isValidDetails(organiser, true)
    ];
    return _.flatten(errors);
};

var isValidWithoutPassword = (organiser) => {
    var errors = [
        isValidDetails(organiser, false)
    ];
    return _.flatten(errors);
};

export default {
    isValid: isValid,
    isValidWithoutPassword: isValidWithoutPassword
};
