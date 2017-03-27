'use strict';

const inputValidator = require('./inputValidator');
const _ = require('lodash');

const isValidBranch = name =>
  inputValidator.isValidString(name, new RegExp('[<>"%;&+]')) && name.length < 256;

const noPasswordRequired = {
  name: inputValidator.isValidOptionalName,
  email: inputValidator.isValidEmail,
  phoneNumber: inputValidator.isValidOptionalPhoneNumber,
  branchId: isValidBranch,
};

const superAdminNoPasswordRequired = {
  name: inputValidator.isValidOptionalName,
  email: inputValidator.isValidEmail,
  phoneNumber: inputValidator.isValidOptionalPhoneNumber,
};

const passwordRequired = {
  name: inputValidator.isValidOptionalName,
  email: inputValidator.isValidEmail,
  phoneNumber: inputValidator.isValidOptionalPhoneNumber,
  password: inputValidator.isValidPassword,
};

const isValidDetails = (admin, fieldsChecks) =>
  _.reduce(fieldsChecks, (errors, checkFn, adminFieldKey) => {
    if (!admin || !checkFn(admin[adminFieldKey])) {
      errors.push(adminFieldKey);
    }
    return errors;
  }, []);

const isValid = admin => {
  const errors = [isValidDetails(admin, passwordRequired)];
  return _.flatten(errors);
};

const isValidWithoutPassword = admin => {
  const errors = [isValidDetails(admin, noPasswordRequired)];
  return _.flatten(errors);
};

const isSuperAdminValidWithoutPassword = admin => {
  const errors = [isValidDetails(admin, superAdminNoPasswordRequired)];
  return _.flatten(errors);
};

module.exports = {
  isValid,
  isValidWithoutPassword,
  isSuperAdminValidWithoutPassword,
};
