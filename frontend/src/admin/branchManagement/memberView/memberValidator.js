import inputValidator from '../../../lib/inputValidator';
import { FormValidationErrors } from '../../config/strings';

export default values => {
  const {
    email,
    primaryPhoneNumber,
    firstName,
    lastName,
    additionalInfo,
    notes,
  } = values;
  const errors = {};

  if (!inputValidator.isValidEmail(email)) {
    errors.email = FormValidationErrors.contactEmail.message;
  }

  if (!inputValidator.isValidOptionalPhoneNumber(primaryPhoneNumber)) {
    errors.primaryPhoneNumber = FormValidationErrors.contactNumber.message;
  }

  if (!inputValidator.isValidName(firstName)) {
    errors.firstName = FormValidationErrors.memberName.message;
  }

  if (!inputValidator.isValidOptionalName(lastName)) {
    errors.lastName = FormValidationErrors.memberLastName.message;
  }

  if (!inputValidator.isValidOptionalTextBlock(additionalInfo)) {
    errors.additionalInfo = FormValidationErrors.additionalInfo.message;
  }

  if (!inputValidator.isValidOptionalTextBlock(notes)) {
    errors.notes = FormValidationErrors.notes.message;
  }

  return errors;
};
