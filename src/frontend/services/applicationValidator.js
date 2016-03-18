'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const applicationFieldsChecks =
{
    contactName: inputValidator.isValidName,
    contactLastName: inputValidator.isValidOptionalName,
    contactEmail: inputValidator.isValidEmail,
    contactNumber: inputValidator.isValidPhone,
    participantName: inputValidator.isValidName,
    participantLastName: inputValidator.isValidOptionalName,
    participantBirthYear:  inputValidator.isValidYear,
    labSelection: inputValidator.isValidText,
    schoolType: inputValidator.isValidName,
    schoolTypeOtherText: inputValidator.isValidOptionalName,
    additionalInfo: inputValidator.isValidOptionalTextBlock
};

var isValidDetails = (application) => {
    return _.reduce(applicationFieldsChecks, function(errors, checkFn, applicationFieldKey) {
        if (!application || !checkFn(application[applicationFieldKey])){
            errors.push(applicationFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (application) => {
    var errors = [
        isValidDetails(application)
    ];
    return _.flatten(errors);
};

export default {
    isValid: isValid
};
