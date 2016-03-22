'use strict';

let inputValidator = require('./inputValidator');
const _ = require('lodash');

const branchFieldsChecks =
{
    name: inputValidator.isValidName,
    notes: inputValidator.isValidOptionalTextBlock,
    contact: inputValidator.isValidOptionalTextBlock
};

var isValidDetails = (branch) => {
    return _.reduce(branchFieldsChecks, function(errors, checkFn, branchFieldKey) {
        if (!branch || !checkFn(branch[branchFieldKey])){
            errors.push(branchFieldKey);
        }
        return errors;
    },[]);
};

var isValid = (branch) => {
    var errors = [
        isValidDetails(branch)
    ];
    return _.flatten(errors);
};

module.exports = {
    isValid: isValid,
};
