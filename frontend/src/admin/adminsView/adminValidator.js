import inputValidator from '../../lib/inputValidator';
import { FormValidationErrors } from '../config/strings';

export default (values, { isCreating }) => {
  const {
    name,
    phoneNumber,
    email,
    password,
    confirmPassword,
  } = values;
  const errors = {};

  if (!inputValidator.isValidOptionalName(name)) {
    errors.name = FormValidationErrors.name.message;
  }

  if (!inputValidator.isValidEmail(email)) {
    errors.email = FormValidationErrors.contactEmail.message;
  }

  if (!inputValidator.isValidOptionalPhoneNumber(phoneNumber)) {
    errors.phoneNumber = FormValidationErrors.contactNumber.message;
  }

  if (!!password || isCreating) {
    if (!inputValidator.isValidPassword(password)) {
      errors.password = FormValidationErrors.password.message;
    }
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = FormValidationErrors.confirmedPassword.message;
  }

  return errors;
};
