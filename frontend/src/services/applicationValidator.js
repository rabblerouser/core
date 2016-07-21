import inputValidator from '../lib/inputValidator';
import _ from 'lodash';

const applicationFieldsChecks = {
  contactEmail: inputValidator.isValidEmail,
  contactNumber: inputValidator.isValidPhone,
  memberName: inputValidator.isValidName,
  memberLastName: inputValidator.isValidOptionalName,
  branchSelection: inputValidator.isValidText,
  additionalInfo: inputValidator.isValidOptionalTextBlock,
};

const isValidDetails = application => (
  _.reduce(applicationFieldsChecks, (errors, checkFn, applicationFieldKey) => {
    if (!application || !checkFn(application[applicationFieldKey])) {
      errors.push(applicationFieldKey);
    }
    return errors;
  }, [])
);

const isValid = application => _.flatten([isValidDetails(application)]);

export default { isValid };
