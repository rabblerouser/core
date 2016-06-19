import inputValidator from '../lib/inputValidator';
import _ from 'lodash';

const memberFieldsChecks = {
  contactName: inputValidator.isValidName,
  contactLastName: inputValidator.isValidOptionalName,
  contactEmail: inputValidator.isValidEmail,
  contactNumber: inputValidator.isValidPhone,
  memberName: inputValidator.isValidName,
  memberLastName: inputValidator.isValidOptionalName,
  memberBirthYear: inputValidator.isValidYear,
  additionalInfo: inputValidator.isValidOptionalTextBlock,
  pastoralNotes: inputValidator.isValidOptionalTextBlock,
};

const isValidDetails = member => (
  _.reduce(memberFieldsChecks, (errors, checkFn, memberFieldKey) => {
    if (!member || !checkFn(member[memberFieldKey])) {
      errors.push(memberFieldKey);
    }
    return errors;
  }, [])
);

const isValid = member => _.flatten([isValidDetails(member)]);

export default { isValid };
