import inputValidator from '../../../lib/inputValidator';
import { FormValidationErrors } from '../../../config/strings';

export default values => {
  const errors = {};
  if (!values.name) {
    inputValidator.isValidText(values.name);
    errors.name = FormValidationErrors.name.message;
  }
  return errors;
};
