'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const memberFieldsChecks =
{
    contactName: inputValidator.isValidName,
    contactLastName: inputValidator.isValidOptionalName,
    contactEmail: inputValidator.isValidEmail,
    contactNumber: inputValidator.isValidPhone,
    participantName: inputValidator.isValidName,
    participantLastName: inputValidator.isValidOptionalName,
    participantBirthYear:  inputValidator.isValidYear,
    schoolType: inputValidator.isValidName,
    schoolTypeOtherText: inputValidator.isValidOptionalName,
    additionalInfo: inputValidator.isValidOptionalTextBlock,
    pastoralNotes: inputValidator.isValidOptionalTextBlock
};

var isValidDetails = (member) => {
    return _.reduce(memberFieldsChecks, function(errors, checkFn, memberFieldKey) {
        if (!member || !checkFn(member[memberFieldKey])){
            errors.push(memberFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (member) => {
    var errors = [
        isValidDetails(member)
    ];
    return _.flatten(errors);
};

export default {
    isValid: isValid
};
