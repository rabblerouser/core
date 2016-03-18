'use strict';
import inputValidator from '../../backend/lib/inputValidator';
import _ from 'lodash';

const groupFieldsChecks =
{
    name: inputValidator.isValidName,
    description: inputValidator.isValidTextBlock
};

var isValidDetails = (group) => {
    return _.reduce(groupFieldsChecks, function(errors, checkFn, groupFieldKey) {
        if (!group || !checkFn(group[groupFieldKey])){
            errors.push(groupFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (group) => {
    var errors = [
        isValidDetails(group)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid
};
