import inputValidator from '../../../backend/src/lib/inputValidator';
import _ from 'lodash';

const applicationFieldsChecks = {
  contactName: inputValidator.isValidName,
  contactLastName: inputValidator.isValidOptionalName,
  contactEmail: inputValidator.isValidEmail,
  contactNumber: inputValidator.isValidPhone,
  participantName: inputValidator.isValidName,
  participantLastName: inputValidator.isValidOptionalName,
  participantBirthYear: inputValidator.isValidYear,
  labSelection: inputValidator.isValidText,
  schoolType: inputValidator.isValidName,
  schoolTypeOtherText: inputValidator.isValidOptionalName,
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
