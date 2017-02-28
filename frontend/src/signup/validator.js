import _ from 'lodash';
import {
  isValidOptionalTextBlock,
  isValidText,
  isValidEmail,
  isValidOptionalPhoneNumber,
  isValidName,
} from './inputValidator';
import { validationErrors } from './strings';

export default (
  { additionalInfo,
    branchId,
    email,
    phoneNumber,
    name,
  } = {}) => {
  const errors = {};
  errors.additionalInfo = !isValidOptionalTextBlock(additionalInfo) && validationErrors.additionalInfo;
  errors.branchId = !isValidText(branchId) && validationErrors.branchId;
  errors.email = !isValidEmail(email) && validationErrors.email;
  errors.phoneNumber = !isValidOptionalPhoneNumber(phoneNumber) && validationErrors.phoneNumber;
  errors.name = !isValidName(name) && validationErrors.name;
  return _.pick(errors, err => !!err);
};
