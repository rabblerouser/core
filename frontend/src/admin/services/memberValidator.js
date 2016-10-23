import inputValidator from '../../lib/inputValidator';
import _ from 'lodash';

const memberFieldsChecks = {
  contactEmail: inputValidator.isValidEmail,
  contactNumber: inputValidator.isValidOptionalPhoneNumber,
  memberName: inputValidator.isValidName,
  memberLastName: inputValidator.isValidOptionalName,
  additionalInfo: inputValidator.isValidOptionalTextBlock,
  notes: inputValidator.isValidOptionalTextBlock,
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
