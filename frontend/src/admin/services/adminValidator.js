import inputValidator from '../../lib/inputValidator';
import _ from 'lodash';

const adminFieldsChecks = {
  name: inputValidator.isValidOptionalName,
  email: inputValidator.isValidEmail,
  phoneNumber: inputValidator.isValidOptionalPhoneNumber,
};

const withPasswordFieldCheck = {
  name: inputValidator.isValidOptionalName,
  email: inputValidator.isValidEmail,
  phoneNumber: inputValidator.isValidOptionalPhoneNumber,
  password: inputValidator.isValidPassword,
};

const isValidDetails = (admin, checkPassword) => {
  const fieldsChecks = checkPassword ? withPasswordFieldCheck : adminFieldsChecks;
  return _.reduce(fieldsChecks, (errors, checkFn, adminFieldKey) => {
    if (!admin || !checkFn(admin[adminFieldKey])) {
      errors.push(adminFieldKey);
    }
    return errors;
  }, []);
};

const isValid = admin => _.flatten([isValidDetails(admin, true)]);

const isValidWithoutPassword = admin => _.flatten([isValidDetails(admin, false)]);

export default {
  isValid,
  isValidWithoutPassword,
};
