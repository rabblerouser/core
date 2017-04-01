'use strict';

const inputValidator = require('./inputValidator');
const _ = require('lodash');

const memberFieldsChecks = {
  email: inputValidator.isValidEmail,
  phoneNumber: inputValidator.isValidOptionalPhoneNumber,
  name: inputValidator.isValidName,
  additionalInfo: inputValidator.isValidOptionalTextBlock,
  notes: inputValidator.isValidOptionalTextBlock,
};

const isValidDetails = member =>
  _.reduce(memberFieldsChecks, (errors, checkFn, memberFieldKey) => {
    if (!member || !checkFn(member[memberFieldKey])) {
      errors.push(memberFieldKey);
    }
    return errors;
  }, []);

const isValid = member => {
  const errors = [isValidDetails(member)];
  return _.flatten(errors);
};

module.exports = {
  isValid,
};
