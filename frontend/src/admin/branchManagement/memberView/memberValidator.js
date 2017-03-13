import inputValidator from '../../common/inputValidator';

const errorStrings = {
  email: 'Please enter a valid email address. E.g. valid@email.com',
  phoneNumber: 'Please enter a valid phone number.',
  name: 'Please enter the member\'s name. No symbols allowed.',
  additionalInfo: 'Maximum 2000 characters',
  notes: 'Maximum 2000 characters',
};

export default values => {
  const {
    email,
    phoneNumber,
    name,
    additionalInfo,
    notes,
  } = values;
  const errors = {};

  if (!inputValidator.isValidEmail(email)) {
    errors.email = errorStrings.email;
  }

  if (!inputValidator.isValidOptionalPhoneNumber(phoneNumber)) {
    errors.phoneNumber = errorStrings.phoneNumber;
  }

  if (!inputValidator.isValidName(name)) {
    errors.name = errorStrings.name;
  }

  if (!inputValidator.isValidOptionalTextBlock(additionalInfo)) {
    errors.additionalInfo = errorStrings.additionalInfo;
  }

  if (!inputValidator.isValidOptionalTextBlock(notes)) {
    errors.notes = errorStrings.notes;
  }

  return errors;
};
