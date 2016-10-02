import _ from 'lodash';
import {
  isValidOptionalTextBlock,
  isValidText,
  isValidEmail,
  isValidOptionalPhoneNumber,
  isValidOptionalName,
  isValidName,
} from '../lib/inputValidator';
import { validationErrors } from './strings';

export default (
  { additionalInfo,
    branchId,
    email,
    primaryPhoneNumber,
    lastName,
    firstName,
  } = {}) => {
  const errors = {};
  errors.additionalInfo = !isValidOptionalTextBlock(additionalInfo) && validationErrors.additionalInfo;
  errors.branchId = !isValidText(branchId) && validationErrors.branchId;
  errors.email = !isValidEmail(email) && validationErrors.email;
  errors.primaryPhoneNumber = !isValidOptionalPhoneNumber(primaryPhoneNumber) && validationErrors.primaryPhoneNumber;
  errors.lastName = !isValidOptionalName(lastName) && validationErrors.lastName;
  errors.firstName = !isValidName(firstName) && validationErrors.firstName;
  return _.pick(errors, err => !!err);
};
