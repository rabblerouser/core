import inputValidator from '../../../lib/inputValidator';
import { FormValidationErrors } from '../../config/strings';

export default values => {
  const errors = {};
  if (!values.name || !inputValidator.isValidText(values.name)) {
    errors.name = FormValidationErrors.groupName.message;
  }
  if (!values.description || !inputValidator.isValidOptionalTextBlock(values.description)) {
    errors.description = FormValidationErrors.groupDescription.message;
  }

  return errors;
};
