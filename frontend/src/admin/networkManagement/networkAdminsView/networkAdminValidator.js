import inputValidator from '../../../lib/inputValidator';

const errorStrings = {
  name: 'Please enter a name. No symbols allowed.',
  contactEmail: 'Please enter a valid email address. E.g. valid@email.com',
  contactNumber: 'Please enter a valid phone number.',
  password: 'Passwords must be at least 12 characters',
  confirmedPassword: 'Passwords must match',
};

export default (values, { isCreating }) => {
  const {
    name,
    phoneNumber,
    email,
    password,
    confirmPassword,
  } = values;
  const errors = {};

  if (!inputValidator.isValidOptionalName(name)) {
    errors.name = errorStrings.name;
  }

  if (!inputValidator.isValidEmail(email)) {
    errors.email = errorStrings.contactEmail;
  }

  if (!inputValidator.isValidOptionalPhoneNumber(phoneNumber)) {
    errors.phoneNumber = errorStrings.contactNumber;
  }

  if (!!password || isCreating) {
    if (!inputValidator.isValidPassword(password)) {
      errors.password = errorStrings.password;
    }
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = errorStrings.confirmedPassword;
  }

  return errors;
};
