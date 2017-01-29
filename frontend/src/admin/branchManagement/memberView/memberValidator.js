import inputValidator from '../../common/inputValidator';

const errorStrings = {
  email: 'Please enter a valid email address. E.g. valid@email.com',
  primaryPhoneNumber: 'Please enter a valid phone number.',
  firstName: 'Please enter the member\'s name. No symbols allowed.',
  lastName: 'No symbols allowed.',
  additionalInfo: 'Maximum 2000 characters',
  notes: 'Maximum 2000 characters',
};

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
    errors.email = errorStrings.email;
  }

  if (!inputValidator.isValidOptionalPhoneNumber(primaryPhoneNumber)) {
    errors.primaryPhoneNumber = errorStrings.primaryPhoneNumber;
  }

  if (!inputValidator.isValidName(firstName)) {
    errors.firstName = errorStrings.firstName;
  }

  if (!inputValidator.isValidOptionalName(lastName)) {
    errors.lastName = errorStrings.lastName;
  }

  if (!inputValidator.isValidOptionalTextBlock(additionalInfo)) {
    errors.additionalInfo = errorStrings.additionalInfo;
  }

  if (!inputValidator.isValidOptionalTextBlock(notes)) {
    errors.notes = errorStrings.notes;
  }

  return errors;
};
