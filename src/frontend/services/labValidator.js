'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const labFieldsChecks =
{
    name: inputValidator.isValidName
};

var isValidDetails = (lab) => {
    return _.reduce(labFieldsChecks, function(errors, checkFn, labFieldKey) {
        if (!lab || !checkFn(lab[labFieldKey])){
            errors.push(labFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (lab) => {
    var errors = [
        isValidDetails(lab)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid
};
