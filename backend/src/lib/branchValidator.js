'use strict';

const inputValidator = require('./inputValidator');
const _ = require('lodash');

const branchFieldsChecks = {
  name: inputValidator.isValidText,
  notes: inputValidator.isValidOptionalTextBlock,
  contact: inputValidator.isValidOptionalTextBlock,
};

const isValidDetails = branch =>
  _.reduce(branchFieldsChecks, (errors, checkFn, branchFieldKey) => {
    if (!branch || !checkFn(branch[branchFieldKey])) {
      errors.push(branchFieldKey);
    }
    return errors;
  }, []);

const isValid = branch => {
  const errors = [isValidDetails(branch)];
  return _.flatten(errors);
};

module.exports = {
  isValid,
};
