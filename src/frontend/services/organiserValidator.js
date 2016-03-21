'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const organiserFieldsChecks =
{
    name: inputValidator.isValidOptionalName,
    email: inputValidator.isValidEmail,
    phoneNumber: inputValidator.isValidPhone
};

var isValidDetails = (organiser) => {
    return _.reduce(organiserFieldsChecks, function(errors, checkFn, organiserFieldKey) {
        if (!organiser || !checkFn(organiser[organiserFieldKey])){
            errors.push(organiserFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (organiser) => {
    var errors = [
        isValidDetails(organiser)
    ];
    return _.flatten(errors);
};

export default {
    isValid: isValid
};
