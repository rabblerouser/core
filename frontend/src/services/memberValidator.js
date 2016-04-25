import inputValidator from '../../../backend/src/lib/inputValidator';
import _ from 'lodash';

const memberFieldsChecks = {
  contactName: inputValidator.isValidName,
  contactLastName: inputValidator.isValidOptionalName,
  contactEmail: inputValidator.isValidEmail,
  contactNumber: inputValidator.isValidPhone,
  participantName: inputValidator.isValidName,
  participantLastName: inputValidator.isValidOptionalName,
  participantBirthYear: inputValidator.isValidYear,
  schoolType: inputValidator.isValidName,
  schoolTypeOtherText: inputValidator.isValidOptionalName,
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
